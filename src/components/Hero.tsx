import React from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-dark-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0],
            scale: [1, 0.95, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating Particles */}
        <motion.div 
          className="absolute top-1/2 left-1/6 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400/30 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/6 w-1 sm:w-1 h-1 sm:h-1 bg-cyan-400/40 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div 
          className="space-y-8 sm:space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="space-y-6 sm:space-y-8">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight leading-none tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="block text-white mb-2 sm:mb-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Digital
              </motion.span>
              <motion.span 
                className="block gradient-text font-light"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Minimalist
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-light tracking-wide max-w-2xl mx-auto leading-relaxed text-balance px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Crafting clean, purposeful digital experiences through thoughtful design and precise execution
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.button 
              onClick={scrollToWork}
              className="group inline-flex items-center space-x-3 bg-white hover:bg-white/90 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium btn-modern focus-ring text-base sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View my work"
            >
              <span>View Work</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={14} className="sm:w-4 sm:h-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <motion.div 
            className="w-px h-12 sm:h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent"
            animate={{ scaleY: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-white/40 font-light tracking-wider uppercase">Scroll</div>
        </div>
      </motion.div>
    </section>
  );
}