import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-px bg-border">
      <motion.div className="h-full origin-left bg-accent" style={{ scaleX }} />
    </div>
  );
}
