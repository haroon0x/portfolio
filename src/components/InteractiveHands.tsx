import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface InteractiveHandsProps {
  onExplore: () => void;
}

const spring = { stiffness: 170, damping: 24, mass: 0.7 };

export default function InteractiveHands({ onExplore }: InteractiveHandsProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pullY = useMotionValue(0);
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const topX = useTransform(() => smoothX.get() * 12);
  const topY = useTransform(() => smoothY.get() * 8 - pullY.get() * 0.05);
  const bottomX = useTransform(() => smoothX.get() * -9);
  const bottomY = useTransform(() => smoothY.get() * -6 + pullY.get() * 0.08);
  const topRotate = useTransform(() => smoothX.get() * 0.8);
  const bottomRotate = useTransform(() => smoothX.get() * -0.65);
  const signalX = useTransform(() => smoothX.get() * 18);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const releaseSignal = () => {
    const shouldExplore = pullY.get() > 48;
    animate(pullY, 0, { type: 'spring', stiffness: 360, damping: 28 });
    if (shouldExplore) onExplore();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[34rem]"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.18em] text-text-muted">
        <span>Human input</span>
        <span className="text-accent">Live signal</span>
      </div>
      <div
        ref={stageRef}
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
        className="interactive-hands relative isolate aspect-[4/5] w-full overflow-hidden border-y border-border"
      >
        <div className="absolute inset-x-0 top-1/2 z-20 h-px bg-border/70" />
        <div className="absolute inset-y-0 left-1/2 z-20 w-px bg-border/40" />
        <motion.picture
          style={{ x: topX, y: topY, rotate: topRotate }}
          className="absolute inset-[-3%] z-10 [clip-path:inset(0_0_49.8%_0)]"
        >
          <source type="image/webp" srcSet="/hands-960.webp 960w, /hands-1600.webp 1600w" sizes="(min-width: 1024px) 34rem, 90vw" />
          <img src="/hands-960.webp" alt="" aria-hidden="true" className="hand-art-image h-full w-full object-cover" />
        </motion.picture>
        <motion.picture
          style={{ x: bottomX, y: bottomY, rotate: bottomRotate }}
          className="absolute inset-[-3%] z-10 [clip-path:inset(49.8%_0_0_0)]"
        >
          <source type="image/webp" srcSet="/hands-960.webp 960w, /hands-1600.webp 1600w" sizes="(min-width: 1024px) 34rem, 90vw" />
          <img src="/hands-960.webp" alt="" aria-hidden="true" className="hand-art-image h-full w-full object-cover" />
        </motion.picture>
        <div className="absolute left-1/2 top-1/2 z-30 h-28 -translate-x-1/2">
          <div className="absolute left-1/2 top-3 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-accent/70 to-transparent" />
          <motion.button
            type="button"
            aria-label="Explore selected work"
            onClick={onExplore}
            drag={shouldReduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 80 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={releaseSignal}
            style={{ x: signalX, y: pullY }}
            whileTap={{ scale: 0.88 }}
            className="group absolute left-1/2 top-0 -ml-5 flex h-10 w-10 touch-none items-center justify-center rounded-full border border-accent bg-accent text-accent-foreground shadow-[0_0_0_8px_rgb(var(--color-accent)/0.12)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="pointer-events-none absolute left-12 whitespace-nowrap font-mono text-[0.58rem] uppercase tracking-[0.16em] text-accent opacity-90 transition-transform duration-300 group-hover:translate-x-1">
              Pull to work ↓
            </span>
          </motion.button>
        </div>
        <span className="absolute bottom-4 left-4 z-20 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-text-muted">Pointer reactive</span>
        <span className="absolute bottom-4 right-4 z-20 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-text-muted">Drag / tap</span>
      </div>
    </motion.div>
  );
}
