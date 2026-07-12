import React, { useEffect, useRef } from 'react';

export default function LilyGarden({ children }: { children: React.ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let x = 50;
    let y = 42;
    let targetX = 50;
    let targetY = 42;

    const update = () => {
      x += (targetX - x) * 0.035;
      y += (targetY - y) * 0.035;
      shell.style.setProperty('--ambient-x', `${x}%`);
      shell.style.setProperty('--ambient-y', `${y}%`);
      frame = window.requestAnimationFrame(update);
    };

    const handlePointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  return (
    <div ref={shellRef} className="ambient-shell">
      <div className="ambient-wash" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-one" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-two" aria-hidden="true" />
      <div className="ambient-grain" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
