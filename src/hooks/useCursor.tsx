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
      
      if (target.matches('button, a, [role="button"], input, textarea, select')) {
        setCursorVariant('button');
        setIsHovering(true);
      } else if (target.matches('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"]')) {
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

    // Smooth cursor movement with requestAnimationFrame
    let animationId: number;
    const smoothUpdatePosition = (e: MouseEvent) => {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', smoothUpdatePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Hide cursor when leaving window
    const handleMouseLeaveWindow = () => {
      setIsHovering(false);
    };

    const handleMouseEnterWindow = () => {
      setIsHovering(false);
    };

    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', smoothUpdatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { position, isHovering, cursorVariant };
}