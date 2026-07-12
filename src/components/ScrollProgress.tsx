import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? Math.min(window.scrollY / documentHeight, 1) : 0;
      setScrollProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-px bg-border">
      <div
        className="h-full bg-accent origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
}
