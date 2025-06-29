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
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Geometric Elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"
          style={{ transform: `translate(${offset * 0.05}px, ${offset * 0.02}px)` }}
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float"
          style={{ 
            transform: `translate(${offset * -0.03}px, ${offset * -0.04}px)`,
            animationDelay: '3s'
          }}
        />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-20 grid-minimal" />
      </div>

      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="space-y-12 animate-fade-in">
          <div className="space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight leading-none tracking-tighter">
              <span className="block text-white mb-4">
                Digital
              </span>
              <span className="block gradient-text font-light">
                Minimalist
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Crafting clean, purposeful digital experiences through thoughtful design and precise execution
            </p>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-delayed">
            <button 
              onClick={scrollToWork}
              className="group inline-flex items-center space-x-3 bg-white hover:bg-white/90 text-black px-8 py-4 rounded-full font-medium transition-all duration-500 btn-minimal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="View my work"
            >
              <span>View Work</span>
              <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse-minimal" />
      </div>
    </section>
  );
}