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
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black perspective-2000">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 preserve-3d">
        {/* Animated Background Grid with 3D depth */}
        <div className="absolute inset-0 opacity-20 transform-3d">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              animation: 'grid-move 20s linear infinite',
              transform: 'translateZ(-50px)'
            }}
          />
        </div>

        {/* 3D Floating Geometric Shapes */}
        <motion.div 
          className="absolute top-1/4 left-1/6 w-16 h-16 border border-white/10 rounded-lg preserve-3d"
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 180],
            translateZ: [0, 20, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transform: 'translateZ(30px)' }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl preserve-3d"
          animate={{ 
            rotateX: [0, -180],
            rotateZ: [0, 360],
            translateZ: [0, -15, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(20px)' }}
        />

        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-8 h-8 border border-cyan-400/20 rounded-full preserve-3d"
          animate={{ 
            rotateY: [0, 360],
            translateZ: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(15px)' }}
        />
      </div>

      {/* 3D Floating Particles */}
      <div className="absolute inset-0 pointer-events-none preserve-3d">
        <motion.div 
          className="absolute top-1/4 left-1/6 w-2 h-2 bg-blue-400/40 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
            rotateZ: [0, 180, 360]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(40px)' }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
            translateZ: [0, 10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ transform: 'translateZ(25px)' }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300/50 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.5, 0.9, 0.5],
            rotateX: [0, 360],
            translateZ: [0, -5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ transform: 'translateZ(35px)' }}
        />
      </div>

      {/* Main Content with 3D Transform */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto preserve-3d">
        <motion.div 
          className="space-y-12 transform-3d"
          initial={{ opacity: 0, translateZ: -100 }}
          animate={{ opacity: 1, translateZ: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Main Title with 3D Text Effect */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50, translateZ: -50 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="preserve-3d"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-none tracking-tighter text-3d">
                <motion.span 
                  className="block text-white mb-4"
                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  Digital
                </motion.span>
                <motion.span 
                  className="block gradient-text font-light relative text-3d-glow"
                  initial={{ opacity: 0, x: 50, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Minimalist
                  {/* 3D Underline effect */}
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-blue-400/0"
                    initial={{ width: 0, translateZ: -10 }}
                    animate={{ width: "100%", translateZ: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    style={{ transform: 'translateZ(10px)' }}
                  />
                </motion.span>
              </h1>
            </motion.div>
            
            {/* 3D Tagline with Icons */}
            <motion.div 
              className="flex items-center justify-center space-x-8 text-white/60 preserve-3d"
              initial={{ opacity: 0, y: 30, translateZ: -30 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="flex items-center space-x-2 card-3d"
                whileHover={{ 
                  scale: 1.05, 
                  color: "#3b82f6",
                  translateZ: 10,
                  rotateY: 5
                }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateZ(15px)' }}
              >
                <Code size={18} />
                <span className="text-sm font-light">Code</span>
              </motion.div>
              <div className="w-px h-4 bg-white/20" style={{ transform: 'translateZ(5px)' }} />
              <motion.div 
                className="flex items-center space-x-2 card-3d"
                whileHover={{ 
                  scale: 1.05, 
                  color: "#06b6d4",
                  translateZ: 10,
                  rotateY: -5
                }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateZ(15px)' }}
              >
                <Palette size={18} />
                <span className="text-sm font-light">Design</span>
              </motion.div>
              <div className="w-px h-4 bg-white/20" style={{ transform: 'translateZ(5px)' }} />
              <motion.div 
                className="flex items-center space-x-2 card-3d"
                whileHover={{ 
                  scale: 1.05, 
                  color: "#0ea5e9",
                  translateZ: 10,
                  rotateY: 3
                }}
                transition={{ duration: 0.3 }}
                style={{ transform: 'translateZ(15px)' }}
              >
                <Zap size={18} />
                <span className="text-sm font-light">Experience</span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-balance"
              initial={{ opacity: 0, y: 20, translateZ: -20 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              style={{ transform: 'translateZ(10px)' }}
            >
              Crafting purposeful digital experiences through thoughtful design and precise execution
            </motion.p>
          </div>

          {/* 3D CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20, translateZ: -40 }}
            animate={{ opacity: 1, y: 0, translateZ: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="preserve-3d"
          >
            <motion.button 
              onClick={scrollToWork}
              className="group relative inline-flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full font-medium backdrop-blur-sm btn-3d focus-ring"
              whileHover={{ 
                scale: 1.05,
                translateZ: 15,
                rotateX: -5,
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95, translateZ: 5 }}
              style={{ transform: 'translateZ(20px)' }}
            >
              <span>Explore Work</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={16} />
              </motion.div>
              
              {/* 3D Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: 'translateZ(-5px)' }}
                initial={false}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block preserve-3d"
        initial={{ opacity: 0, translateZ: -30 }}
        animate={{ opacity: 1, translateZ: 0 }}
        transition={{ delay: 2 }}
        style={{ transform: 'translateZ(25px)' }}
      >
        <div className="flex flex-col items-center space-y-3">
          <motion.div 
            className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"
            animate={{ 
              scaleY: [1, 0.7, 1],
              translateZ: [0, 5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-white/30 font-light tracking-widest uppercase">Scroll</div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0) translateZ(-50px); }
          100% { transform: translate(100px, 100px) translateZ(-50px); }
        }
      `}</style>
    </section>
  );
}