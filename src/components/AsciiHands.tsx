import { motion, useReducedMotion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

interface AsciiHandsProps {
  onExplore: () => void;
}

const columns = 52;
const rows = 59;
const characters = ' .:-=+*#%@';

interface PointerSample {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  intensity: number;
  time: number;
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

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

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
  const idleTimeoutRef = useRef<number>();
  const pointerRef = useRef<PointerSample>({ x: 0, y: 0, velocityX: 0, velocityY: 0, intensity: 1, time: 0 });
  const phaseRef = useRef<FieldPhase>('loading');
  const decodeCompleteRef = useRef(false);
  const stageVisibleRef = useRef(true);
  const documentVisibleRef = useRef(!document.hidden);
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
    const radius = clamp(stageBounds.width * 0.16, 96, 148);
    const pointer = pointerRef.current;
    const fieldLeft = fieldBounds.left - stageBounds.left;
    const fieldTop = fieldBounds.top - stageBounds.top;
    const nextActiveGlyphs = new Set<GlyphNode>();

    glyphNodesRef.current.forEach((node) => {
      const x = fieldLeft + (node.column + 0.5) * cellWidth;
      const y = fieldTop + (node.row + 0.5) * cellHeight;
      const deltaX = x - pointer.x;
      const deltaY = y - pointer.y;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance >= radius) return;

      const strength = 1 - distance / radius;
      const directionX = distance > 0 ? deltaX / distance : 0;
      const directionY = distance > 0 ? deltaY / distance : 0;
      const push = shouldReduceMotion ? 0 : (3 + Math.pow(strength, 1.7) * 15) * pointer.intensity;
      const velocityOffsetX = shouldReduceMotion ? 0 : clamp(pointer.velocityX * -0.003, -6, 6) * strength * pointer.intensity;
      const velocityOffsetY = shouldReduceMotion ? 0 : clamp(pointer.velocityY * -0.003, -6, 6) * strength * pointer.intensity;
      const growth = shouldReduceMotion ? 1 : 1 + strength * 0.46 * pointer.intensity;
      const sourceIndex = characters.indexOf(node.source);
      const glyphIndex = clamp(sourceIndex + Math.round(strength * 2 * pointer.intensity), 1, characters.length - 1);
      const offsetX = (directionX * push + velocityOffsetX) / horizontalScale;
      const offsetY = (directionY * push + velocityOffsetY) / verticalScale;

      node.element.style.transition = 'none';
      node.element.style.opacity = String((0.24 + Math.pow(strength, 0.72) * 0.76) * pointer.intensity);
      node.element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${growth})`;
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

  const moveField = useCallback((x: number, y: number, trackVelocity: boolean, intensity = 1) => {
    const now = window.performance.now();
    const previous = pointerRef.current;
    const elapsed = Math.max(now - previous.time, 16);

    pointerRef.current = {
      x,
      y,
      velocityX: trackVelocity && previous.time ? ((x - previous.x) / elapsed) * 1000 : 0,
      velocityY: trackVelocity && previous.time ? ((y - previous.y) / elapsed) * 1000 : 0,
      intensity,
      time: now,
    };
    scheduleDraw();
  }, [scheduleDraw]);

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
      const x = bounds.width / 2 + Math.sin(angle * 2) * bounds.width * 0.18;
      const y = bounds.height / 2 + Math.sin(angle * 3 + Math.PI / 2) * bounds.height * 0.16;

      moveField(x, y, false, intensity);
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
    if (!ascii || decodeCompleteRef.current) return;
    if (decodeFrameRef.current !== undefined) window.cancelAnimationFrame(decodeFrameRef.current);

    if (shouldReduceMotion) {
      decodeCompleteRef.current = true;
      phaseRef.current = 'live';
      setPhase('live');
      lastInteractionRef.current = window.performance.now();
      scheduleIdle();
      return;
    }

    phaseRef.current = 'decoding';
    setPhase('decoding');
    const startedAt = window.performance.now();
    const columnCount = Math.max(...ascii.split('\n').map((line) => line.length));

    const animateDecode = (now: number) => {
      const elapsed = now - startedAt;
      const noiseFrame = Math.floor(elapsed / 55);

      glyphNodesRef.current.forEach((node, index) => {
        const rowJitter = ((node.row * 47) % 241) - 120;
        const lockAt = 180 + (node.column / Math.max(columnCount - 1, 1)) * 980 + rowJitter;
        const sinceLock = elapsed - lockAt;

        node.element.style.transition = 'none';
        node.element.style.transform = 'translate3d(0, 0, 0) scale(1)';

        if (sinceLock < 0) {
          const noiseIndex = (index * 7 + noiseFrame * 3) % characters.length;
          node.element.textContent = characters[noiseIndex];
          node.element.style.color = 'rgb(var(--color-text-muted))';
          node.element.style.opacity = String(0.18 + ((index + noiseFrame) % 4) * 0.06);
          return;
        }

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
        time: window.performance.now(),
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
        stopIdle();
        return;
      }
      scheduleIdle();
    }, { threshold: 0.05 });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [scheduleIdle, stopIdle]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      documentVisibleRef.current = !document.hidden;
      if (document.hidden) {
        if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
        stopIdle();
        return;
      }
      scheduleIdle();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [scheduleIdle, stopIdle]);

  useEffect(() => () => {
    if (drawFrameRef.current !== undefined) window.cancelAnimationFrame(drawFrameRef.current);
    if (decodeFrameRef.current !== undefined) window.cancelAnimationFrame(decodeFrameRef.current);
    if (idleFrameRef.current !== undefined) window.cancelAnimationFrame(idleFrameRef.current);
    if (idleTimeoutRef.current !== undefined) window.clearTimeout(idleTimeoutRef.current);
    resetField();
  }, [resetField]);

  const beginInteraction = useCallback((x: number, y: number, trackVelocity: boolean) => {
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
    moveField(x, y, trackVelocity, 1);
    scheduleIdle();
  }, [moveField, scheduleIdle, stopIdle]);

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
