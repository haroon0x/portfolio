import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

export default function About() {
  const { ref, isVisible } = useScrollAnimation();

  const skills = [
    { skill: 'Design Systems', level: 95 },
    { skill: 'Frontend Development', level: 90 },
    { skill: 'User Experience', level: 88 },
    { skill: 'Brand Strategy', level: 85 }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden perspective-1000">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 transform-gpu preserve-3d ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Content with 3D Effects */}
            <div className="space-y-8 sm:space-y-10 preserve-3d">
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter text-3d"
                initial={{ opacity: 0, translateZ: -50 }}
                animate={isVisible ? { opacity: 1, translateZ: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ transform: 'translateZ(30px)' }}
              >
                About
                <span className="block gradient-text font-light mt-2 text-3d-glow"
                      style={{ transform: 'translateZ(40px)' }}>
                  Philosophy
                </span>
              </motion.h2>
              
              <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-white/70 leading-relaxed font-light preserve-3d">
                <motion.p 
                  className="transform-3d"
                  initial={{ opacity: 0, x: -30, translateZ: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0, translateZ: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ transform: 'translateZ(15px)' }}
                >
                  I believe in the power of simplicity. Every pixel, every interaction, every decision is made with intention and purpose.
                </motion.p>
                <motion.p 
                  className="transform-3d"
                  initial={{ opacity: 0, x: -30, translateZ: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0, translateZ: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ transform: 'translateZ(10px)' }}
                >
                  My approach combines minimalist aesthetics with functional excellence, creating digital experiences that feel effortless yet sophisticated.
                </motion.p>
              </div>

              {/* Skills with 3D Progress Bars */}
              <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 preserve-3d">
                {skills.map((item, index) => (
                  <motion.div 
                    key={item.skill} 
                    className="group transform-3d card-3d" 
                    initial={{ opacity: 0, y: 20, translateZ: -15 }}
                    animate={isVisible ? { opacity: 1, y: 0, translateZ: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                    whileHover={{ translateZ: 8, rotateX: 2 }}
                    style={{ transform: 'translateZ(5px)' }}
                  >
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-white font-medium text-sm sm:text-base">{item.skill}</span>
                      <span className="text-white/50 text-xs sm:text-sm">{item.level}%</span>
                    </div>
                    <div className="w-full h-px bg-white/20 relative overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 delay-300 transform-gpu"
                        initial={{ width: 0, translateZ: -2 }}
                        animate={isVisible ? { 
                          width: `${item.level}%`,
                          translateZ: 0,
                          boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                        } : {}}
                        transition={{ duration: 1, delay: 1 + (index * 0.1) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced 3D Visual */}
            <div className="relative preserve-3d order-first lg:order-last">
              <motion.div 
                className="aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden relative group card-3d card-layers"
                initial={{ opacity: 0, rotateY: 15, translateZ: -30 }}
                animate={isVisible ? { opacity: 1, rotateY: 0, translateZ: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                whileHover={{ 
                  rotateY: -5, 
                  rotateX: 5, 
                  translateZ: 20,
                  scale: 1.02
                }}
              >
                {/* 3D Layered Elements */}
                <div className="absolute inset-4 sm:inset-8 space-y-6 sm:space-y-8 transform-gpu preserve-3d">
                  <motion.div 
                    className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent transform-3d"
                    style={{ transform: 'translateZ(15px)' }}
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      scaleX: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transform-3d"
                    style={{ transform: 'translateZ(10px)' }}
                    animate={{ 
                      opacity: [0.4, 0.8, 0.4],
                      scaleX: [1, 0.9, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  <motion.div 
                    className="w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent transform-3d"
                    style={{ transform: 'translateZ(5px)' }}
                    animate={{ 
                      opacity: [0.3, 0.7, 0.3],
                      scaleX: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                </div>
                
                {/* 3D Floating Element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 preserve-3d">
                  <motion.div 
                    className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-xl sm:rounded-2xl group-hover:rotate-90 transition-all duration-700 transform-gpu hover-3d card-3d"
                    animate={{ 
                      rotate: [0, 360],
                      translateZ: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ transform: 'translateZ(20px)' }}
                  />
                </div>

                {/* 3D Depth Indicators */}
                <motion.div 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400/30 rounded-full animate-pulse-3d"
                  style={{ transform: 'translateZ(25px)' }}
                />
                <motion.div 
                  className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-1 sm:w-1 h-1 sm:h-1 bg-cyan-400/40 rounded-full animate-pulse-3d"
                  style={{ 
                    transform: 'translateZ(30px)',
                    animationDelay: '1s'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}