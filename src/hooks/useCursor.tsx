import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export function useCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button' | 'project'>('default');

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if target is an Element and has the matches method
      if (!target || typeof target.matches !== 'function') {
        setCursorVariant('default');
        setIsHovering(false);
        return;
      }
      
      if (target.matches('button, a, [role="button"]')) {
        setCursorVariant('button');
        setIsHovering(true);
      } else if (target.matches('h1, h2, h3, h4, h5, h6, p, span')) {
        setCursorVariant('text');
        setIsHovering(true);
      } else if (target.closest('[data-cursor="project"]')) {
        setCursorVariant('project');
        setIsHovering(true);
      } else {
        setCursorVariant('default');
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return { position, isHovering, cursorVariant };
}