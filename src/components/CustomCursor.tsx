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
        return { outer: 24, inner: 4 };
      case 'text':
        return { outer: 16, inner: 2 };
      case 'project':
        return { outer: 32, inner: 6 };
      default:
        return { outer: 20, inner: 3 };
    }
  };

  const size = getCursorSize();
  const scale = isHovering ? 1.2 : 1;

  return (
    <>
      {/* Ultra Minimal Outer Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-white/20 transition-all duration-300 ease-out"
        style={{
          width: `${size.outer}px`,
          height: `${size.outer}px`,
          transform: `translate(${position.x - size.outer/2}px, ${position.y - size.outer/2}px) scale(${scale})`,
          opacity: isHovering ? 0.6 : 0.3,
          borderColor: cursorVariant === 'project' ? 'rgba(6, 182, 212, 0.4)' : 
                      cursorVariant === 'button' ? 'rgba(59, 130, 246, 0.4)' : 
                      'rgba(255, 255, 255, 0.2)',
        }}
      />
      
      {/* Minimal Inner Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full bg-white transition-all duration-200 ease-out"
        style={{
          width: `${size.inner}px`,
          height: `${size.inner}px`,
          transform: `translate(${position.x - size.inner/2}px, ${position.y - size.inner/2}px)`,
          opacity: isHovering ? 0.8 : 0.6,
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}