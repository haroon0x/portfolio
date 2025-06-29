import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useParallax } from '../hooks/useScrollAnimation';

export default function Hero() {
  const offset = useParallax();

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-dark">
      {/* Enhanced Background Elements with Parallax */}
      <div className="absolute inset-0">
        {/* Floating Geometric Elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ 
            transform: `translate(${offset * 0.05}px, ${offset * 0.02}px) scale(${1 + offset * 0.0001})` 
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"
          style={{ 
            transform: `translate(${offset * -0.03}px, ${offset * -0.04}px) scale(${1 + offset * 0.0001})`,
            animationDelay: '3s'
          }}
        />
        
        {/* Additional Parallax Elements */}
        <div 
          className="absolute top-1/2 left-1/6 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-2xl"
          style={{ transform: `translateY(${offset * 0.08}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-full blur-2xl"
          style={{ transform: `translateY(${offset * -0.06}px)` }}
        />
        
        {/* Subtle Grid with Parallax */}
        <div 
          className="absolute inset-0 opacity-20 grid-minimal"
          style={{ transform: `translateY(${offset * 0.1}px)` }}
        />
      </div>

      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Enhanced Main Content with Stagger Animation */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight leading-none tracking-tighter">
              <span className="block text-white mb-4 animate-fade-in">
                Digital
              </span>
              <span className="block gradient-text font-light animate-fade-in-delayed">
                Minimalist
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
              Crafting clean, purposeful digital experiences through thoughtful design and precise execution
            </p>
          </div>

          {/* Enhanced CTA with Hover Effects */}
          <div className="animate-fade-in-delayed" style={{ animationDelay: '1.2s' }}>
            <button 
              onClick={scrollToWork}
              className="group inline-flex items-center space-x-3 bg-white hover:bg-white/90 text-black px-8 py-4 rounded-full font-medium transition-all duration-500 btn-minimal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative overflow-hidden"
              aria-label="View my work"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              
              <span className="relative z-10">View Work</span>
              <ArrowDown size={16} className="relative z-10 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse-minimal" />
          <div className="text-xs text-white/40 font-light tracking-wider uppercase">Scroll</div>
        </div>
      </div>

      {/* Floating Elements for Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 right-20 w-2 h-2 bg-blue-400/30 rounded-full animate-float"
          style={{ 
            transform: `translateY(${offset * 0.15}px)`,
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute bottom-32 left-16 w-1 h-1 bg-cyan-400/40 rounded-full animate-float"
          style={{ 
            transform: `translateY(${offset * -0.12}px)`,
            animationDelay: '2s'
          }}
        />
      </div>
    </section>
  );
}