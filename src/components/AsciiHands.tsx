import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AsciiHandsProps {
  onExplore: () => void;
}

const columns = 52;
const rows = 59;
const characters = ' .:-=+*#%@';

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

  return lines.join('\n');
}

export default function AsciiHands({ onExplore }: AsciiHandsProps) {
  const stageRef = useRef<HTMLButtonElement>(null);
  const [ascii, setAscii] = useState('');
  const [isActive, setIsActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 28, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 28, mass: 0.55 });
  const probeTransform = useMotionTemplate`translate3d(${smoothX}px, ${smoothY}px, 0) translate(-50%, -50%)`;
  const probeMask = useMotionTemplate`radial-gradient(circle 5rem at ${smoothX}px ${smoothY}px, black 0%, black 24%, transparent 72%)`;

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
      pointerX.set(entry.contentRect.width / 2);
      pointerY.set(entry.contentRect.height / 2);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [pointerX, pointerY]);

  const updatePointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
    setIsActive(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[35rem]"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-muted">
        <span>Human / machine</span>
        <span className="text-accent">ASCII signal</span>
      </div>
      <button
        ref={stageRef}
        type="button"
        aria-label="Explore selected work"
        onClick={onExplore}
        onPointerMove={updatePointer}
        onPointerEnter={() => !shouldReduceMotion && setIsActive(true)}
        onPointerLeave={() => setIsActive(false)}
        className="ascii-hand-stage group relative flex aspect-[4/5] w-full items-center justify-center focus-visible:outline-offset-8"
      >
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-border transition-colors duration-200 group-hover:border-accent" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-border transition-colors duration-200 group-hover:border-accent" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-border transition-colors duration-200 group-hover:border-accent" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-border transition-colors duration-200 group-hover:border-accent" />
        <pre aria-hidden="true" className="ascii-hand-art text-text-secondary">{ascii}</pre>
        <motion.pre
          aria-hidden="true"
          style={{ WebkitMaskImage: probeMask, maskImage: probeMask }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="ascii-hand-art pointer-events-none absolute text-accent"
        >
          {ascii}
        </motion.pre>
        <motion.span
          aria-hidden="true"
          style={{ transform: probeTransform }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-none absolute left-0 top-0 h-5 w-5 rounded-full border border-accent"
        >
          <span className="absolute left-1/2 top-1/2 h-px w-9 -translate-x-1/2 -translate-y-1/2 bg-accent/65" />
          <span className="absolute left-1/2 top-1/2 h-9 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/65" />
        </motion.span>
      </button>
      <div className="mt-3 flex items-center justify-between font-mono text-[0.56rem] uppercase tracking-[0.16em] text-text-muted">
        <span>Move to inspect</span>
        <span>Click to enter work ↘</span>
      </div>
    </motion.div>
  );
}
