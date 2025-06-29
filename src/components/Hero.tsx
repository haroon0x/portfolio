import React from 'react';
import { ArrowDown, Code, Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400/40 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300/50 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Subtle Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/5 right-1/5 w-20 h-20 border border-white/5 rounded-lg"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/6 w-12 h-12 border border-cyan-400/10 rounded-full"
          animate={{ 
            rotate: [360, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Main Title with Staggered Animation */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-none tracking-tighter">
                <motion.span 
                  className="block text-white mb-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Digital
                </motion.span>
                <motion.span 
                  className="block gradient-text font-light relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Minimalist
                  {/* Subtle underline effect */}
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1.2 }}
                  />
                </motion.span>
              </h1>
            </motion.div>
            
            {/* Tagline with Icons */}
            <motion.div 
              className="flex items-center justify-center space-x-8 text-white/60"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05, color: "#3b82f6" }}
                transition={{ duration: 0.3 }}
              >
                <Code size={18} />
                <span className="text-sm font-light">Code</span>
              </motion.div>
              <div className="w-px h-4 bg-white/20" />
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05, color: "#06b6d4" }}
                transition={{ duration: 0.3 }}
              >
                <Palette size={18} />
                <span className="text-sm font-light">Design</span>
              </motion.div>
              <div className="w-px h-4 bg-white/20" />
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05, color: "#0ea5e9" }}
                transition={{ duration: 0.3 }}
              >
                <Zap size={18} />
                <span className="text-sm font-light">Experience</span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Crafting purposeful digital experiences through thoughtful design and precise execution
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.button 
              onClick={scrollToWork}
              className="group relative inline-flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-medium backdrop-blur-sm transition-all duration-500 focus-ring"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Work</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={16} />
              </motion.div>
              
              {/* Subtle glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center space-y-3">
          <motion.div 
            className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"
            animate={{ scaleY: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-white/30 font-light tracking-widest uppercase">Scroll</div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
      `}</style>
    </section>
  );
}