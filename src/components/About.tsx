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
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden perspective-2000">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 preserve-3d">
        <motion.div 
          className="absolute top-1/5 right-1/6 w-32 h-32 border border-white/10 rounded-2xl animate-rotate-3d-enhanced"
          style={{ transform: 'translateZ(-60px)' }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/8 w-24 h-24 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-3xl animate-float-3d-enhanced"
          style={{ 
            transform: 'translateZ(-40px)',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 transform-gpu preserve-3d ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Enhanced Content with 3D Effects */}
            <div className="space-y-8 sm:space-y-10 preserve-3d">
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter text-3d-enhanced"
                initial={{ opacity: 0, translateZ: -100 }}
                animate={isVisible ? { opacity: 1, translateZ: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ transform: 'translateZ(60px)' }}
              >
                About
                <span className="block gradient-text font-light mt-2 text-3d-glow-enhanced"
                      style={{ transform: 'translateZ(80px)' }}>
                  Philosophy
                </span>
              </motion.h2>
              
              <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-white/70 leading-relaxed font-light preserve-3d">
                <motion.p 
                  className="transform-3d"
                  initial={{ opacity: 0, x: -50, translateZ: -40 }}
                  animate={isVisible ? { opacity: 1, x: 0, translateZ: 0 } : {}}
                  transition={{ duration: 1, delay: 0.4 }}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  I believe in the power of simplicity. Every pixel, every interaction, every decision is made with intention and purpose.
                </motion.p>
                <motion.p 
                  className="transform-3d"
                  initial={{ opacity: 0, x: -50, translateZ: -40 }}
                  animate={isVisible ? { opacity: 1, x: 0, translateZ: 0 } : {}}
                  transition={{ duration: 1, delay: 0.6 }}
                  style={{ transform: 'translateZ(25px)' }}
                >
                  My approach combines minimalist aesthetics with functional excellence, creating digital experiences that feel effortless yet sophisticated.
                </motion.p>
              </div>

              {/* Enhanced Skills with 3D Progress Bars */}
              <div className="space-y-6 pt-6 sm:pt-8 preserve-3d">
                {skills.map((item, index) => (
                  <motion.div 
                    key={item.skill} 
                    className="group transform-3d card-3d card-layers-enhanced p-4 bg-white/5 rounded-xl border border-white/10" 
                    initial={{ opacity: 0, y: 30, translateZ: -30 }}
                    animate={isVisible ? { opacity: 1, y: 0, translateZ: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 + (index * 0.15) }}
                    whileHover={{ 
                      translateZ: 20, 
                      rotateX: 3,
                      scale: 1.02
                    }}
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-medium text-sm sm:text-base">{item.skill}</span>
                      <span className="text-white/50 text-xs sm:text-sm font-mono">{item.level}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/20 relative overflow-hidden rounded-full">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000 delay-300 transform-gpu rounded-full"
                        initial={{ width: 0, translateZ: -5 }}
                        animate={isVisible ? { 
                          width: `${item.level}%`,
                          translateZ: 0,
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                        } : {}}
                        transition={{ duration: 1.5, delay: 1.2 + (index * 0.15) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced 3D Visual */}
            <div className="relative preserve-3d order-first lg:order-last">
              <motion.div 
                className="aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/20 overflow-hidden relative group card-3d card-layers-enhanced"
                initial={{ opacity: 0, rotateY: 25, translateZ: -60 }}
                animate={isVisible ? { opacity: 1, rotateY: 0, translateZ: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
                whileHover={{ 
                  rotateY: -8, 
                  rotateX: 8, 
                  translateZ: 40,
                  scale: 1.05
                }}
              >
                {/* Enhanced 3D Layered Elements */}
                <div className="absolute inset-8 space-y-8 transform-gpu preserve-3d">
                  <motion.div 
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent transform-3d rounded-full"
                    style={{ transform: 'translateZ(30px)' }}
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      scaleX: [1, 1.2, 1],
                      translateZ: [30, 40, 30]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transform-3d rounded-full"
                    style={{ transform: 'translateZ(20px)' }}
                    animate={{ 
                      opacity: [0.4, 0.9, 0.4],
                      scaleX: [1, 0.8, 1],
                      translateZ: [20, 30, 20]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  />
                  <motion.div 
                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent transform-3d rounded-full"
                    style={{ transform: 'translateZ(10px)' }}
                    animate={{ 
                      opacity: [0.3, 0.8, 0.3],
                      scaleX: [1, 1.1, 1],
                      translateZ: [10, 20, 10]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3
                    }}
                  />
                </div>
                
                {/* Enhanced 3D Floating Element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 preserve-3d">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-2xl group-hover:rotate-90 transition-all duration-700 transform-gpu card-3d border border-white/20"
                    animate={{ 
                      rotate: [0, 360],
                      translateZ: [0, 25, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ transform: 'translateZ(50px)' }}
                  />
                </div>

                {/* Enhanced 3D Depth Indicators */}
                <motion.div 
                  className="absolute top-4 right-4 w-3 h-3 bg-blue-400/50 rounded-full animate-pulse-3d-enhanced border border-blue-400/30"
                  style={{ transform: 'translateZ(60px)' }}
                />
                <motion.div 
                  className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse-3d-enhanced border border-cyan-400/30"
                  style={{ 
                    transform: 'translateZ(70px)',
                    animationDelay: '1.5s'
                  }}
                />
                <motion.div 
                  className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-blue-300/70 rounded-full animate-pulse-3d-enhanced"
                  style={{ 
                    transform: 'translateZ(80px)',
                    animationDelay: '0.8s'
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