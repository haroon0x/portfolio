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
        return { outer: 32, inner: 8 };
      case 'text':
        return { outer: 24, inner: 4 };
      case 'project':
        return { outer: 40, inner: 10 };
      default:
        return { outer: 28, inner: 6 };
    }
  };

  const size = getCursorSize();
  const scale = isHovering ? 1.3 : 1;

  return (
    <>
      {/* Enhanced Outer Ring - More Visible */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border-2 transition-all duration-300 ease-out"
        style={{
          width: `${size.outer}px`,
          height: `${size.outer}px`,
          transform: `translate(${position.x - size.outer/2}px, ${position.y - size.outer/2}px) scale(${scale})`,
          opacity: isHovering ? 0.8 : 0.6,
          borderColor: cursorVariant === 'project' ? 'rgba(6, 182, 212, 0.7)' : 
                      cursorVariant === 'button' ? 'rgba(59, 130, 246, 0.7)' : 
                      'rgba(255, 255, 255, 0.5)',
          boxShadow: isHovering ? 
            (cursorVariant === 'project' ? '0 0 20px rgba(6, 182, 212, 0.3)' :
             cursorVariant === 'button' ? '0 0 20px rgba(59, 130, 246, 0.3)' :
             '0 0 15px rgba(255, 255, 255, 0.2)') : 'none'
        }}
      />
      
      {/* Enhanced Inner Dot - More Visible */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-200 ease-out"
        style={{
          width: `${size.inner}px`,
          height: `${size.inner}px`,
          transform: `translate(${position.x - size.inner/2}px, ${position.y - size.inner/2}px)`,
          opacity: isHovering ? 0.9 : 0.8,
          backgroundColor: cursorVariant === 'project' ? 'rgba(6, 182, 212, 0.8)' :
                          cursorVariant === 'button' ? 'rgba(59, 130, 246, 0.8)' :
                          'rgba(255, 255, 255, 0.8)',
          boxShadow: `0 0 10px ${
            cursorVariant === 'project' ? 'rgba(6, 182, 212, 0.4)' :
            cursorVariant === 'button' ? 'rgba(59, 130, 246, 0.4)' :
            'rgba(255, 255, 255, 0.3)'
          }`
        }}
      />
    </>
  );
}