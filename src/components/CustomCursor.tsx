import React from 'react';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const { position, isHovering, cursorVariant } = useCursor();

  // Don't show custom cursor on touch devices
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  if (isTouchDevice) return null;

  const getCursorSize = () => {
    switch (cursorVariant) {
      case 'button':
        return 'w-12 h-12';
      case 'text':
        return 'w-6 h-6';
      case 'project':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'button':
        return 'bg-blue-400/30 border-2 border-blue-400/50';
      case 'text':
        return 'bg-white/20 border border-white/30';
      case 'project':
        return 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border-2 border-blue-400/40';
      default:
        return 'bg-white/10 border border-white/20';
    }
  };

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-300 ease-out mix-blend-difference ${getCursorSize()} ${getCursorStyles()}`}
        style={{
          transform: `translate(${position.x - (cursorVariant === 'project' ? 32 : cursorVariant === 'button' ? 24 : cursorVariant === 'text' ? 12 : 16)}px, ${position.y - (cursorVariant === 'project' ? 32 : cursorVariant === 'button' ? 24 : cursorVariant === 'text' ? 12 : 16)}px) scale(${isHovering ? 1 : 0.8})`,
        }}
      />
      
      {/* Trailing dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-40 w-1 h-1 bg-white rounded-full transition-all duration-500 ease-out"
        style={{
          transform: `translate(${position.x - 2}px, ${position.y - 2}px)`,
          opacity: isHovering ? 0.3 : 0.8,
        }}
      />
    </>
  );
}