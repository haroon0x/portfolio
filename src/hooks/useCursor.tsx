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
      
      // Enhanced target checking with better fallbacks
      if (!target) {
        setCursorVariant('default');
        setIsHovering(false);
        return;
      }
      
      // Check for interactive elements
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.getAttribute('role') === 'button' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]')) {
        setCursorVariant('button');
        setIsHovering(true);
      } 
      // Check for text elements
      else if (target.tagName === 'H1' || 
               target.tagName === 'H2' || 
               target.tagName === 'H3' || 
               target.tagName === 'H4' || 
               target.tagName === 'H5' || 
               target.tagName === 'H6' || 
               target.tagName === 'P' || 
               target.tagName === 'SPAN' ||
               target.classList.contains('text-') ||
               target.closest('p') ||
               target.closest('h1, h2, h3, h4, h5, h6')) {
        setCursorVariant('text');
        setIsHovering(true);
      } 
      // Check for project cards
      else if (target.closest('[data-cursor="project"]')) {
        setCursorVariant('project');
        setIsHovering(true);
      } 
      // Default state
      else {
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

    // Add event listeners to document for global coverage
    document.addEventListener('mousemove', smoothUpdatePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mouseover', handleMouseEnter, true);

    // Handle cursor visibility when entering/leaving window
    const handleMouseEnterWindow = () => {
      setIsHovering(false);
    };

    const handleMouseLeaveWindow = () => {
      setIsHovering(false);
    };

    document.addEventListener('mouseenter', handleMouseEnterWindow);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      document.removeEventListener('mousemove', smoothUpdatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mouseover', handleMouseEnter, true);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { position, isHovering, cursorVariant };
}