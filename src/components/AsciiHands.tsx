import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
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
  time: number;
}

interface GlyphNode {
  element: HTMLSpanElement;
  row: number;
  column: number;
  source: string;
}

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
  const frameRef = useRef<number>();
  const pointerRef = useRef<PointerSample>({ x: 0, y: 0, velocityX: 0, velocityY: 0, time: 0 });
  const [ascii, setAscii] = useState('');
  const [isActive, setIsActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 28, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 28, mass: 0.55 });
  const probePositionX = shouldReduceMotion ? pointerX : smoothX;
  const probePositionY = shouldReduceMotion ? pointerY : smoothY;
  const probeTransform = useMotionTemplate`translate3d(${probePositionX}px, ${probePositionY}px, 0) translate(-50%, -50%)`;

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
      const push = shouldReduceMotion ? 0 : 3 + Math.pow(strength, 1.7) * 15;
      const velocityOffsetX = shouldReduceMotion ? 0 : clamp(pointer.velocityX * -0.003, -6, 6) * strength;
      const velocityOffsetY = shouldReduceMotion ? 0 : clamp(pointer.velocityY * -0.003, -6, 6) * strength;
      const growth = shouldReduceMotion ? 1 : 1 + strength * 0.46;
      const sourceIndex = characters.indexOf(node.source);
      const glyphIndex = clamp(sourceIndex + Math.round(strength * 2), 1, characters.length - 1);
      const offsetX = (directionX * push + velocityOffsetX) / horizontalScale;
      const offsetY = (directionY * push + velocityOffsetY) / verticalScale;

      node.element.style.transition = 'none';
      node.element.style.opacity = String(0.24 + Math.pow(strength, 0.72) * 0.76);
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
    if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = undefined;
      drawField();
    });
  }, [drawField]);

  const moveField = useCallback((x: number, y: number, trackVelocity: boolean) => {
    const now = window.performance.now();
    const previous = pointerRef.current;
    const elapsed = Math.max(now - previous.time, 16);

    pointerRef.current = {
      x,
      y,
      velocityX: trackVelocity && previous.time ? ((x - previous.x) / elapsed) * 1000 : 0,
      velocityY: trackVelocity && previous.time ? ((y - previous.y) / elapsed) * 1000 : 0,
      time: now,
    };
    pointerX.set(x);
    pointerY.set(y);
    scheduleDraw();
  }, [pointerX, pointerY, scheduleDraw]);

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
      moveField(entry.contentRect.width / 2, entry.contentRect.height / 2, false);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [moveField]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    glyphNodesRef.current = Array.from(field.querySelectorAll<HTMLSpanElement>('[data-ascii-glyph]')).map((element) => ({
      element,
      row: Number(element.dataset.row),
      column: Number(element.dataset.column),
      source: element.dataset.asciiGlyph ?? '',
    }));
    scheduleDraw();
  }, [ascii, scheduleDraw]);

  useEffect(() => () => {
    if (frameRef.current !== undefined) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
    resetField();
  }, [resetField]);

  const updatePointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    moveField(event.clientX - bounds.left, event.clientY - bounds.top, event.pointerType !== 'touch');
    setIsActive(true);
  };

  const activateFromKeyboard = () => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    moveField(bounds.width / 2, bounds.height / 2, false);
    setIsActive(true);
  };

  const deactivateField = () => {
    setIsActive(false);
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
        className="ascii-hand-stage relative flex h-[34rem] w-full cursor-crosshair items-center justify-center focus-visible:outline-offset-8 sm:h-[40rem] lg:h-[min(72svh,48rem)] lg:min-h-[42rem]"
      >
        <pre aria-hidden="true" className="ascii-hand-art text-text-secondary">{ascii}</pre>
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
        <motion.span
          aria-hidden="true"
          style={{ transform: probeTransform }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-none absolute left-0 top-0 flex h-28 w-28 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.025]"
        >
          <span className="relative h-7 w-7 rounded-full border border-accent">
            <span className="absolute left-1/2 top-1/2 h-px w-14 -translate-x-1/2 -translate-y-1/2 bg-accent/65" />
            <span className="absolute left-1/2 top-1/2 h-14 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/65" />
          </span>
        </motion.span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-5 hidden items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.18em] text-text-muted sm:flex">
          <span>ASCII field / live</span>
          <span>Move to distort · Click to explore</span>
        </span>
      </button>
    </motion.div>
  );
}
