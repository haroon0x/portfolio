import { motion, useReducedMotion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

interface AsciiHandsProps {
  onExplore: () => void;
}

const columns = 52;
const rows = 59;
const characters = ' .:-=+*#%@';

type FieldMode = 'live' | 'idle';

interface FieldSource {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  intensity: number;
  mode: FieldMode;
  waveRadius: number;
  waveWidth: number;
}

interface PointerSample extends FieldSource {
  time: number;
  blendFrom?: FieldSource;
  blendProgress: number;
}

interface HandoffState {
  from: FieldSource;
  target: FieldSource;
  startedAt: number;
  targetUpdatedAt: number;
}

interface GlyphNode {
  element: HTMLSpanElement;
  row: number;
  column: number;
  source: string;
}

type FieldPhase = 'loading' | 'decoding' | 'live' | 'idle';

const decodeDuration = 1400;
const idleDelay = 4000;
const idlePeriod = 14000;
const idleWavePeriod = 6000;
const handoffDuration = 300;
let decodePlayedThisPage = false;

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const cubicCoordinate = (time: number, first: number, second: number) => {
  const inverse = 1 - time;
  return 3 * inverse * inverse * time * first + 3 * inverse * time * time * second + time * time * time;
};

const cubicSlope = (time: number, first: number, second: number) => {
  const inverse = 1 - time;
  return 3 * inverse * inverse * first + 6 * inverse * time * (second - first) + 3 * time * time * (1 - second);
};

const cubicBezier = (progress: number, x1: number, y1: number, x2: number, y2: number) => {
  const target = clamp(progress, 0, 1);
  let time = target;

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const slope = cubicSlope(time, x1, x2);
    if (Math.abs(slope) < 0.000001) break;
    time = clamp(time - (cubicCoordinate(time, x1, x2) - target) / slope, 0, 1);
  }

  return cubicCoordinate(time, y1, y2);
};

const decodeEase = (progress: number) => cubicBezier(progress, 0.16, 1, 0.3, 1);
const handoffEase = (progress: number) => cubicBezier(progress, 0.65, 0, 0.35, 1);

const fieldSource = (sample: PointerSample): FieldSource => ({
  x: sample.x,
  y: sample.y,
  velocityX: sample.velocityX,
  velocityY: sample.velocityY,
  intensity: sample.intensity,
  mode: sample.mode,
  waveRadius: sample.waveRadius,
  waveWidth: sample.waveWidth,
});

function renderAscii(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return '';

  canvas.width = columns;
  canvas.height = rows;
  context.drawImage(image, 0, 0, columns, rows);
  const pixels = context.getImageData(0, 0, columns, rows).data;
  const lines: string[] = [];

  for (let y = 0; y < rows; y += 1) {
    let line = '';
    for (let x = 0; x < columns; x += 1) {
      const offset = (y * columns + x) * 4;
      const luminance = pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722;
      const density = Math.max(0, Math.min(1, (202 - luminance) / 188));
      const index = luminance > 202 ? 0 : Math.max(1, Math.round(density * (characters.length - 1)));
      line += characters[index];
    }
    lines.push(line.trimEnd());
  }

  let left = columns;
  let right = 0;

  for (const line of lines) {
    const first = line.search(/\S/);
    if (first === -1) continue;
    left = Math.min(left, first);
    right = Math.max(right, line.length - 1);
  }

  if (left > right) return '';
  left = Math.max(0, left - 1);
  right = Math.min(columns - 1, right + 1);

  return lines.map((line) => line.padEnd(columns).slice(left, right + 1).trimEnd()).join('\n');
}

export default function AsciiHands({ onExplore }: AsciiHandsProps) {
  const stageRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLPreElement>(null);
  const glyphNodesRef = useRef<GlyphNode[]>([]);
  const activeGlyphsRef = useRef<Set<GlyphNode>>(new Set());
  const drawFrameRef = useRef<number>();
  const decodeFrameRef = useRef<number>();
  const idleFrameRef = useRef<number>();
  const handoffFrameRef = useRef<number>();
  const idleTimeoutRef = useRef<number>();
  const pointerRef = useRef<PointerSample>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    intensity: 1,
    mode: 'live',
    waveRadius: 0,
    waveWidth: 0,
    time: 0,
    blendProgress: 1,
  });
  const handoffRef = useRef<HandoffState>();
  const decodeLockTimesRef = useRef<Map<HTMLSpanElement, number>>(new Map());
  const decodeStartedRef = useRef(false);
  const phaseRef = useRef<FieldPhase>('loading');
  const decodeCompleteRef = useRef(false);
  const stageVisibleRef = useRef(true);
  const documentVisibleRef = useRef(typeof document === 'undefined' || !document.hidden);
  const lastInteractionRef = useRef(0);
  const [ascii, setAscii] = useState('');
  const [phase, setPhase] = useState<FieldPhase>('loading');
  const shouldReduceMotion = useReducedMotion();

  const drawField = useCallback(() => {
    const stage = stageRef.current;
    const field = fieldRef.current;
    if (!stage || !field || !ascii) return;

    const stageBounds = stage.getBoundingClientRect();
    const fieldBounds = field.getBoundingClientRect();
    const lines = ascii.split('\n');
    const columnCount = Math.max(...lines.map((line) => line.length));
    const cellWidth = fieldBounds.width / columnCount;
    const cellHeight = fieldBounds.height / lines.length;
    const horizontalScale = fieldBounds.width / field.offsetWidth || 1;
    const verticalScale = fieldBounds.height / field.offsetHeight || 1;
    const liveRadius = clamp(stageBounds.width * 0.16, 96, 148);
    const pointer = pointerRef.current;
    const fieldLeft = fieldBounds.left - stageBounds.left;
    const fieldTop = fieldBounds.top - stageBounds.top;
    const nextActiveGlyphs = new Set<GlyphNode>();
    const sources = pointer.blendFrom
      ? [
          { source: pointer.blendFrom, weight: 1 - pointer.blendProgress },
          { source: fieldSource(pointer), weight: pointer.blendProgress },
        ]
      : [{ source: fieldSource(pointer), weight: 1 }];

    glyphNodesRef.current.forEach((node) => {
      const x = fieldLeft + (node.column + 0.5) * cellWidth;
      const y = fieldTop + (node.row + 0.5) * cellHeight;
      let offsetX = 0;
      let offsetY = 0;
      let growth = 1;
      let densityShift = 0;
      let opacity = 0;

      sources.forEach(({ source, weight }) => {
        if (weight <= 0 || source.intensity <= 0) return;
        const deltaX = x - source.x;
        const deltaY = y - source.y;
        const distance = Math.hypot(deltaX, deltaY);
        const edgeDistance = source.mode === 'idle'
          ? Math.abs(distance - source.waveRadius)
          : distance;
        const influenceRadius = source.mode === 'idle' ? source.waveWidth : liveRadius;
        if (edgeDistance >= influenceRadius) return;

        const strength = 1 - edgeDistance / influenceRadius;
        const directionX = distance > 0 ? deltaX / distance : 0;
        const directionY = distance > 0 ? deltaY / distance : 0;
        const effectiveIntensity = source.intensity * weight;
        const push = shouldReduceMotion ? 0 : (3 + Math.pow(strength, 1.7) * 15) * effectiveIntensity;
        const velocityOffsetX = shouldReduceMotion ? 0 : clamp(source.velocityX * -0.003, -6, 6) * strength * effectiveIntensity;
        const velocityOffsetY = shouldReduceMotion ? 0 : clamp(source.velocityY * -0.003, -6, 6) * strength * effectiveIntensity;

        offsetX += directionX * push + velocityOffsetX;
        offsetY += directionY * push + velocityOffsetY;
        growth += shouldReduceMotion ? 0 : strength * 0.46 * effectiveIntensity;
        densityShift += strength * 2 * effectiveIntensity;
        opacity += (0.24 + Math.pow(strength, 0.72) * 0.76) * effectiveIntensity;
      });

      if (opacity <= 0) return;

      const sourceIndex = characters.indexOf(node.source);
      const glyphIndex = clamp(sourceIndex + Math.round(densityShift), 1, characters.length - 1);

      node.element.style.transition = 'none';
      node.element.style.opacity = String(clamp(opacity, 0, 1));
      node.element.style.transform = `translate3d(${offsetX / horizontalScale}px, ${offsetY / verticalScale}px, 0) scale(${growth})`;
      node.element.textContent = characters[glyphIndex] ?? node.source;
      nextActiveGlyphs.add(node);
    });

    activeGlyphsRef.current.forEach((node) => {
      if (nextActiveGlyphs.has(node)) return;
      node.element.style.removeProperty('transition');
      node.element.style.opacity = '0';
      node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';
      node.element.textContent = node.source;
    });

    activeGlyphsRef.current = nextActiveGlyphs;
  }, [ascii, shouldReduceMotion]);

  const resetField = useCallback(() => {
    activeGlyphsRef.current.forEach((node) => {
      node.element.style.removeProperty('transition');
      node.element.style.opacity = '0';
      node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';
      node.element.textContent = node.source;
    });
    activeGlyphsRef.current.clear();
  }, []);

  const scheduleDraw = useCallback(() => {
    if (drawFrameRef.current !== undefined) window.cancelAnimationFrame(drawFrameRef.current);
    drawFrameRef.current = window.requestAnimationFrame(() => {
      drawFrameRef.current = undefined;
      drawField();
    });
  }, [drawField]);

  const moveField = useCallback((
    x: number,
    y: number,
    trackVelocity: boolean,
    intensity = 1,
    mode: FieldMode = 'live',
    waveRadius = 0,
    waveWidth = 0,
  ) => {
    const now = window.performance.now();
    const handoff = handoffRef.current;
    const previous = handoff?.target ?? fieldSource(pointerRef.current);
    const previousTime = handoff?.targetUpdatedAt ?? pointerRef.current.time;
    const elapsed = Math.max(now - previousTime, 16);
    const next: FieldSource = {
      x,
      y,
      velocityX: trackVelocity && previousTime ? ((x - previous.x) / elapsed) * 1000 : 0,
      velocityY: trackVelocity && previousTime ? ((y - previous.y) / elapsed) * 1000 : 0,
      intensity,
      mode,
      waveRadius,
      waveWidth,
    };

    if (handoff) {
      handoff.target = next;
      handoff.targetUpdatedAt = now;
      pointerRef.current = {
        ...next,
        time: now,
        blendFrom: handoff.from,
        blendProgress: pointerRef.current.blendProgress,
      };
    } else {
      pointerRef.current = { ...next, time: now, blendProgress: 1 };
    }
    scheduleDraw();
  }, [scheduleDraw]);

  const cancelHandoff = useCallback(() => {
    if (handoffFrameRef.current !== undefined) {
      window.cancelAnimationFrame(handoffFrameRef.current);
      handoffFrameRef.current = undefined;
    }
    handoffRef.current = undefined;
    if (pointerRef.current.blendFrom) {
      pointerRef.current = {
        ...fieldSource(pointerRef.current),
        time: window.performance.now(),
        blendProgress: 1,
      };
    }
  }, []);

  const startHandoff = useCallback((from: FieldSource, x: number, y: number, trackVelocity: boolean) => {
    cancelHandoff();
    const startedAt = window.performance.now();
    const target: FieldSource = {
      x,
      y,
      velocityX: trackVelocity ? clamp((x - from.x) * 3.3, -900, 900) : 0,
      velocityY: trackVelocity ? clamp((y - from.y) * 3.3, -900, 900) : 0,
      intensity: 1,
      mode: 'live',
      waveRadius: 0,
      waveWidth: 0,
    };

    handoffRef.current = { from, target, startedAt, targetUpdatedAt: startedAt };

    const animateHandoff = (now: number) => {
      const handoff = handoffRef.current;
      if (!handoff) return;
      const progress = clamp((now - handoff.startedAt) / handoffDuration, 0, 1);
      const blendProgress = handoffEase(progress);

      pointerRef.current = {
        ...handoff.target,
        time: now,
        blendFrom: progress < 1 ? handoff.from : undefined,
        blendProgress,
      };
      scheduleDraw();

      if (progress < 1) {
        handoffFrameRef.current = window.requestAnimationFrame(animateHandoff);
        return;
      }

      handoffFrameRef.current = undefined;
      handoffRef.current = undefined;
    };

    handoffFrameRef.current = window.requestAnimationFrame(animateHandoff);
  }, [cancelHandoff, scheduleDraw]);

  const stopIdle = useCallback((reset = true) => {
    const wasIdle = phaseRef.current === 'idle';
    if (idleFrameRef.current !== undefined) {
      window.cancelAnimationFrame(idleFrameRef.current);
      idleFrameRef.current = undefined;
    }
    if (wasIdle && drawFrameRef.current !== undefined) {
      window.cancelAnimationFrame(drawFrameRef.current);
      drawFrameRef.current = undefined;
    }
    if (wasIdle) {
      phaseRef.current = 'live';
      setPhase('live');
      if (reset) resetField();
    }
  }, [resetField]);

  const startIdle = useCallback(() => {
    if (
      shouldReduceMotion
      || !decodeCompleteRef.current
      || !stageVisibleRef.current
      || !documentVisibleRef.current
    ) return;

    stopIdle(false);
    phaseRef.current = 'idle';
    setPhase('idle');
    const startedAt = window.performance.now();

    const animateIdle = (now: number) => {
      if (
        phaseRef.current !== 'idle'
        || !stageVisibleRef.current
        || !documentVisibleRef.current
      ) return;

      const stage = stageRef.current;
      if (!stage) return;
      const bounds = stage.getBoundingClientRect();
      const elapsed = now - startedAt;
      const angle = (elapsed / idlePeriod) * Math.PI * 2;
      const intensity = Math.min(elapsed / 1000, 1) * 0.3;
      const orbitRadius = Math.min(bounds.width, bounds.height) * 0.3;
      const x = bounds.width / 2 + Math.sin(angle * 2) * orbitRadius;
      const y = bounds.height / 2 + Math.sin(angle * 3 + Math.PI / 2) * orbitRadius;
      const waveProgress = (elapsed % idleWavePeriod) / idleWavePeriod;
      const waveRadius = waveProgress * Math.hypot(bounds.width, bounds.height) * 0.75;
      const waveWidth = clamp(Math.min(bounds.width, bounds.height) * 0.1, 52, 100);

      moveField(x, y, false, intensity, 'idle', waveRadius, waveWidth);
      idleFrameRef.current = window.requestAnimationFrame(animateIdle);
    };

    idleFrameRef.current = window.requestAnimationFrame(animateIdle);
  }, [moveField, shouldReduceMotion, stopIdle]);

  const scheduleIdle = useCallback(() => {
    if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
    if (shouldReduceMotion || !decodeCompleteRef.current) return;

    const elapsed = window.performance.now() - lastInteractionRef.current;
    idleTimeoutRef.current = window.setTimeout(startIdle, Math.max(0, idleDelay - elapsed));
  }, [shouldReduceMotion, startIdle]);

  const startDecode = useCallback(() => {
    if (!ascii || decodeCompleteRef.current || decodeStartedRef.current) return;
    decodeStartedRef.current = true;
    if (decodeFrameRef.current !== undefined) window.cancelAnimationFrame(decodeFrameRef.current);

    if (shouldReduceMotion || decodePlayedThisPage) {
      decodeCompleteRef.current = true;
      phaseRef.current = 'live';
      setPhase('live');
      lastInteractionRef.current = window.performance.now();
      scheduleIdle();
      return;
    }

    decodePlayedThisPage = true;
    decodeLockTimesRef.current.clear();
    phaseRef.current = 'decoding';
    setPhase('decoding');
    const startedAt = window.performance.now();
    const columnCount = Math.max(...ascii.split('\n').map((line) => line.length));
    const sweepDuration = decodeDuration - 240;

    const animateDecode = (now: number) => {
      const elapsed = now - startedAt;
      const noiseFrame = Math.floor(elapsed / 55);

      glyphNodesRef.current.forEach((node, index) => {
        const rowJitter = ((node.row * 47) % 241) - 120;
        const sweepStart = 120 + rowJitter;
        const sweepProgress = decodeEase((elapsed - sweepStart) / sweepDuration);
        const columnProgress = node.column / Math.max(columnCount - 1, 1);
        const isLocked = elapsed >= sweepStart && sweepProgress >= columnProgress;
        let lockAt = decodeLockTimesRef.current.get(node.element);

        node.element.style.transition = 'none';
        node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';

        if (!isLocked) {
          const noiseIndex = (index * 7 + noiseFrame * 3) % characters.length;
          node.element.textContent = characters[noiseIndex];
          node.element.style.color = 'rgb(var(--color-text-muted))';
          node.element.style.opacity = String(0.18 + ((index + noiseFrame) % 4) * 0.06);
          return;
        }

        if (lockAt === undefined) {
          lockAt = elapsed;
          decodeLockTimesRef.current.set(node.element, lockAt);
        }
        const sinceLock = elapsed - lockAt;
        node.element.textContent = node.source;
        node.element.style.color = sinceLock < 150
          ? 'rgb(var(--color-accent))'
          : 'rgb(var(--color-text-secondary))';
        node.element.style.opacity = String(Math.min(0.5 + sinceLock / 220, 1));
      });

      if (elapsed < decodeDuration) {
        decodeFrameRef.current = window.requestAnimationFrame(animateDecode);
        return;
      }

      decodeFrameRef.current = undefined;
      decodeCompleteRef.current = true;
      phaseRef.current = 'live';
      setPhase('live');
      glyphNodesRef.current.forEach((node) => {
        node.element.style.removeProperty('transition');
        node.element.style.removeProperty('color');
        node.element.style.opacity = '0';
        node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';
        node.element.textContent = node.source;
      });
      lastInteractionRef.current = window.performance.now();
      scheduleIdle();
    };

    decodeFrameRef.current = window.requestAnimationFrame(animateDecode);
  }, [ascii, scheduleIdle, shouldReduceMotion]);

  useEffect(() => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => setAscii(renderAscii(image));
    image.src = '/hands-960.webp';
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(([entry]) => {
      pointerRef.current = {
        x: entry.contentRect.width / 2,
        y: entry.contentRect.height / 2,
        velocityX: 0,
        velocityY: 0,
        intensity: 0,
        mode: 'live',
        waveRadius: 0,
        waveWidth: 0,
        time: window.performance.now(),
        blendProgress: 1,
      };
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    glyphNodesRef.current = Array.from(field.querySelectorAll<HTMLSpanElement>('[data-ascii-glyph]')).map((element) => ({
      element,
      row: Number(element.dataset.row),
      column: Number(element.dataset.column),
      source: element.dataset.asciiGlyph ?? '',
    }));
    startDecode();
  }, [ascii, startDecode]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(([entry]) => {
      stageVisibleRef.current = entry.isIntersecting;
      if (!entry.isIntersecting) {
        if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
        cancelHandoff();
        stopIdle();
        resetField();
        return;
      }
      scheduleIdle();
    }, { threshold: 0.05 });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [cancelHandoff, resetField, scheduleIdle, stopIdle]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      documentVisibleRef.current = !document.hidden;
      if (document.hidden) {
        if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
        cancelHandoff();
        stopIdle();
        resetField();
        return;
      }
      scheduleIdle();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cancelHandoff, resetField, scheduleIdle, stopIdle]);

  useEffect(() => () => {
    if (drawFrameRef.current !== undefined) window.cancelAnimationFrame(drawFrameRef.current);
    if (decodeFrameRef.current !== undefined) window.cancelAnimationFrame(decodeFrameRef.current);
    if (idleFrameRef.current !== undefined) window.cancelAnimationFrame(idleFrameRef.current);
    if (handoffFrameRef.current !== undefined) window.cancelAnimationFrame(handoffFrameRef.current);
    if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
    handoffRef.current = undefined;
    resetField();
  }, [resetField]);

  const beginInteraction = useCallback((x: number, y: number, trackVelocity: boolean) => {
    const idleSource = phaseRef.current === 'idle' ? fieldSource(pointerRef.current) : undefined;
    if (decodeFrameRef.current !== undefined) {
      window.cancelAnimationFrame(decodeFrameRef.current);
      decodeFrameRef.current = undefined;
    }
    if (!decodeCompleteRef.current) {
      decodeCompleteRef.current = true;
      glyphNodesRef.current.forEach((node) => {
        node.element.style.removeProperty('transition');
        node.element.style.removeProperty('color');
        node.element.style.opacity = '0';
        node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';
        node.element.textContent = node.source;
      });
    }
    if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
    stopIdle(false);
    phaseRef.current = 'live';
    setPhase('live');
    lastInteractionRef.current = window.performance.now();
    if (idleSource) {
      startHandoff(idleSource, x, y, trackVelocity);
    } else {
      moveField(x, y, trackVelocity, 1);
    }
    scheduleIdle();
  }, [moveField, scheduleIdle, startHandoff, stopIdle]);

  const updatePointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    beginInteraction(event.clientX - bounds.left, event.clientY - bounds.top, event.pointerType !== 'touch');
  };

  const activateFromKeyboard = () => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    beginInteraction(bounds.width / 2, bounds.height / 2, false);
  };

  const deactivateField = () => {
    cancelHandoff();
    resetField();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-none lg:-my-10"
    >
      <button
        ref={stageRef}
        type="button"
        data-field-phase={phase}
        aria-label="Explore selected work"
        onClick={onExplore}
        onFocus={activateFromKeyboard}
        onBlur={deactivateField}
        onPointerDown={updatePointer}
        onPointerMove={(event) => event.pointerType !== 'touch' && updatePointer(event)}
        onPointerEnter={(event) => event.pointerType !== 'touch' && updatePointer(event)}
        onPointerLeave={deactivateField}
        onPointerCancel={deactivateField}
        onPointerUp={(event) => {
          if (event.pointerType !== 'touch') return;
          deactivateField();
        }}
        className="ascii-hand-stage relative flex h-[34rem] w-full cursor-pointer items-center justify-center focus-visible:outline-offset-8 sm:h-[40rem] lg:h-[min(72svh,48rem)] lg:min-h-[42rem]"
      >
        <pre
          aria-hidden="true"
          className={`ascii-hand-art text-text-secondary transition-opacity duration-200 ease-out ${phase === 'loading' || phase === 'decoding' ? 'opacity-0' : 'opacity-100'}`}
        >
          {ascii}
        </pre>
        <pre
          ref={fieldRef}
          aria-hidden="true"
          className="ascii-hand-art pointer-events-none absolute text-accent"
        >
          {ascii.split('\n').map((line, rowIndex, allLines) => (
            <Fragment key={`${rowIndex}-${line}`}>
              {Array.from(line).map((glyph, columnIndex) => glyph === ' ' ? ' ' : (
                <span
                  key={`${rowIndex}-${columnIndex}`}
                  data-ascii-glyph={glyph}
                  data-row={rowIndex}
                  data-column={columnIndex}
                  className="ascii-hand-glyph"
                >
                  {glyph}
                </span>
              ))}
              {rowIndex < allLines.length - 1 ? '\n' : null}
            </Fragment>
          ))}
        </pre>
        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-5 hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-text-muted sm:block">
          ASCII field / live
        </span>
      </button>
    </motion.div>
  );
}
