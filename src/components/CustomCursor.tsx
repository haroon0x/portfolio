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

  const getCursorConfig = () => {
    switch (cursorVariant) {
      case 'button':
        return {
          size: 'w-16 h-16',
          innerSize: 'w-2 h-2',
          outerOpacity: 'opacity-30',
          innerOpacity: 'opacity-90',
          scale: isHovering ? 1.2 : 1,
          borderWidth: '2px',
          color: 'border-blue-400/60 bg-blue-400/10'
        };
      case 'text':
        return {
          size: 'w-8 h-8',
          innerSize: 'w-1 h-1',
          outerOpacity: 'opacity-20',
          innerOpacity: 'opacity-70',
          scale: isHovering ? 1.1 : 1,
          borderWidth: '1px',
          color: 'border-white/40 bg-white/5'
        };
      case 'project':
        return {
          size: 'w-20 h-20',
          innerSize: 'w-3 h-3',
          outerOpacity: 'opacity-40',
          innerOpacity: 'opacity-100',
          scale: isHovering ? 1.3 : 1,
          borderWidth: '2px',
          color: 'border-cyan-400/70 bg-gradient-to-br from-blue-400/15 to-cyan-400/15'
        };
      default:
        return {
          size: 'w-10 h-10',
          innerSize: 'w-1.5 h-1.5',
          outerOpacity: 'opacity-15',
          innerOpacity: 'opacity-60',
          scale: isHovering ? 1 : 0.9,
          borderWidth: '1px',
          color: 'border-white/30 bg-white/5'
        };
    }
  };

  const config = getCursorConfig();
  const offset = cursorVariant === 'project' ? 40 : cursorVariant === 'button' ? 32 : 20;
  const innerOffset = cursorVariant === 'project' ? 6 : cursorVariant === 'button' ? 4 : 3;

  return (
    <>
      {/* Main Cursor Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-500 ease-out mix-blend-difference ${config.size} ${config.outerOpacity} ${config.color}`}
        style={{
          transform: `translate(${position.x - offset}px, ${position.y - offset}px) scale(${config.scale})`,
          border: `${config.borderWidth} solid`,
          transitionProperty: 'transform, opacity, border-color, background-color',
        }}
      >
        {/* Inner Geometric Elements */}
        <div className="absolute inset-0 rounded-full">
          {/* Rotating Border Accent */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              cursorVariant === 'project' ? 'border-2 border-transparent border-t-cyan-400/50 animate-spin' :
              cursorVariant === 'button' ? 'border border-transparent border-t-blue-400/40' : ''
            }`}
            style={{ 
              animationDuration: cursorVariant === 'project' ? '3s' : '2s',
              animationDirection: isHovering ? 'normal' : 'reverse'
            }}
          />
          
          {/* Subtle Grid Pattern for Project Hover */}
          {cursorVariant === 'project' && (
            <div className="absolute inset-2 rounded-full opacity-20">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-px">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-cyan-400/30 rounded-full transition-all duration-300"
                    style={{ 
                      animationDelay: `${i * 0.1}s`,
                      transform: isHovering ? 'scale(1)' : 'scale(0.5)',
                      opacity: isHovering ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Inner Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-300 ease-out ${config.innerSize} ${config.innerOpacity} bg-white`}
        style={{
          transform: `translate(${position.x - innerOffset}px, ${position.y - innerOffset}px) scale(${isHovering ? 1.2 : 1})`,
          mixBlendMode: 'difference',
        }}
      />
      
      {/* Trailing Elements */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-40 w-px h-px bg-white/40 rounded-full transition-all duration-700 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isHovering ? 0.2 : 0.6,
          transitionDelay: '0.1s'
        }}
      />
      
      {/* Additional Trailing Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-40 w-0.5 h-0.5 bg-white/20 rounded-full transition-all duration-1000 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isHovering ? 0.1 : 0.4,
          transitionDelay: '0.2s'
        }}
      />

      {/* Ambient Glow for Special States */}
      {(cursorVariant === 'project' || cursorVariant === 'button') && (
        <div
          className={`fixed top-0 left-0 pointer-events-none z-30 rounded-full transition-all duration-700 ease-out ${
            cursorVariant === 'project' ? 'w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10' :
            'w-24 h-24 bg-gradient-to-br from-blue-400/8 to-cyan-400/8'
          }`}
          style={{
            transform: `translate(${position.x - (cursorVariant === 'project' ? 64 : 48)}px, ${position.y - (cursorVariant === 'project' ? 64 : 48)}px) scale(${isHovering ? 1 : 0.8})`,
            opacity: isHovering ? 1 : 0,
            filter: 'blur(20px)',
          }}
        />
      )}
    </>
  );
}