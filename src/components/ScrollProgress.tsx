import React from 'react';
import { useAdvancedScrollAnimation } from '../hooks/useScrollAnimation';

export default function ScrollProgress() {
  const { scrollProgress } = useAdvancedScrollAnimation();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-px bg-white/10">
      <div 
        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
}