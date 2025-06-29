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
    <section id="about" className="py-32 bg-black relative">
      <div className="max-w-5xl mx-auto px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div className="space-y-10">
              <h2 className="text-6xl md:text-7xl font-extralight text-white leading-none tracking-tighter">
                About
                <span className="block gradient-text font-light mt-2">
                  Philosophy
                </span>
              </h2>
              
              <div className="space-y-8 text-lg text-white/70 leading-relaxed font-light">
                <p>
                  I believe in the power of simplicity. Every pixel, every interaction, every decision is made with intention and purpose.
                </p>
                <p>
                  My approach combines minimalist aesthetics with functional excellence, creating digital experiences that feel effortless yet sophisticated.
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-6 pt-8">
                {skills.map((item) => (
                  <div key={item.skill} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-medium">{item.skill}</span>
                      <span className="text-white/50 text-sm">{item.level}%</span>
                    </div>
                    <div className="w-full h-px bg-white/20">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 delay-300"
                        style={{ width: isVisible ? `${item.level}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 overflow-hidden relative group card-minimal">
                {/* Abstract Elements */}
                <div className="absolute inset-8 space-y-8">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
                </div>
                
                {/* Floating Element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}