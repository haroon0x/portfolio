import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  const skills = [
    { skill: 'Design Systems', level: 95 },
    { skill: 'Frontend Development', level: 90 },
    { skill: 'User Experience', level: 88 },
    { skill: 'Brand Strategy', level: 85 }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 transform-gpu ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8 sm:space-y-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter">
                About
                <span className="block gradient-text font-light mt-2">
                  Philosophy
                </span>
              </h2>
              
              <div className="space-y-8 text-lg text-white/70 leading-relaxed font-light">
                <p className="transform-3d">
                  I believe in the power of simplicity. Every pixel, every interaction, every decision is made with intention and purpose.
                </p>
                <p className="transform-3d">
                  My approach combines minimalist aesthetics with functional excellence, creating digital experiences that feel effortless yet sophisticated.
                </p>
              </div>

              {/* Skills with Progress Bars */}
              <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8">
                {skills.map((item, index) => (
                  <div key={item.skill} className="group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-white font-medium text-sm sm:text-base">{item.skill}</span>
                      <span className="text-white/50 text-xs sm:text-sm">{item.level}%</span>
                    </div>
                    <div className="w-full h-px bg-white/20 relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 delay-300 transform-gpu"
                        style={{ 
                          width: isVisible ? `${item.level}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative order-first lg:order-last">
              <div className="aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden relative group card-modern">
                {/* Layered Elements */}
                <div className="absolute inset-4 sm:inset-8 space-y-6 sm:space-y-8">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
                </div>
                
                {/* Floating Element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-xl sm:rounded-2xl rotate-45 group-hover:rotate-90 transition-all duration-700" />
                </div>

                {/* Subtle Depth Indicators */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400/30 rounded-full animate-pulse" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-1 sm:w-1 h-1 sm:h-1 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}