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
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black perspective-3000">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 preserve-3d">
        {/* 3D Animated Background Grid */}
        <div className="absolute inset-0 opacity-30 transform-3d">
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `
                linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '120px 120px',
              animation: 'grid-3d-move 25s linear infinite',
              transform: 'translateZ(-150px) rotateX(15deg)'
            }}
          />
        </div>

        {/* Large 3D Floating Geometric Shapes */}
        <motion.div 
          className="absolute top-1/6 left-1/6 w-32 h-32 border-2 border-white/20 rounded-2xl preserve-3d shape-3d"
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 180],
            translateZ: [0, 50, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transform: 'translateZ(80px)' }}
        />
        
        <motion.div 
          className="absolute top-1/4 right-1/5 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-3xl preserve-3d shape-3d"
          animate={{ 
            rotateX: [0, -180],
            rotateZ: [0, 360],
            translateZ: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(60px)' }}
        />

        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-20 h-20 border-2 border-cyan-400/30 rounded-full preserve-3d shape-3d"
          animate={{ 
            rotateY: [0, 360],
            translateZ: [0, 40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(70px)' }}
        />

        {/* Orbiting 3D Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 preserve-3d">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl"
            style={{ transform: 'translateZ(120px)' }}
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Enhanced 3D Floating Particles */}
      <div className="absolute inset-0 pointer-events-none preserve-3d">
        <motion.div 
          className="absolute top-1/5 left-1/8 w-4 h-4 bg-blue-400/60 rounded-full animate-pulse-3d-enhanced"
          style={{ transform: 'translateZ(100px)' }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/6 w-3 h-3 bg-cyan-400/80 rounded-full animate-pulse-3d-enhanced"
          style={{ 
            transform: 'translateZ(80px)',
            animationDelay: '1s'
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-blue-300/70 rounded-full animate-pulse-3d-enhanced"
          style={{ 
            transform: 'translateZ(90px)',
            animationDelay: '2s'
          }}
        />

        <motion.div 
          className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-300/90 rounded-full animate-pulse-3d-enhanced"
          style={{ 
            transform: 'translateZ(110px)',
            animationDelay: '0.5s'
          }}
        />
      </div>

      {/* Main Content with Enhanced 3D Transform */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto preserve-3d">
        <motion.div 
          className="space-y-12 transform-3d"
          initial={{ opacity: 0, translateZ: -200 }}
          animate={{ opacity: 1, translateZ: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Enhanced Main Title with 3D Text Effect */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 80, translateZ: -100 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="preserve-3d"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-none tracking-tighter text-3d-enhanced">
                <motion.span 
                  className="block text-white mb-4"
                  initial={{ opacity: 0, x: -80, rotateY: -25 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ transform: 'translateZ(50px)' }}
                >
                  Digital
                </motion.span>
                <motion.span 
                  className="block gradient-text font-light relative text-3d-glow-enhanced"
                  initial={{ opacity: 0, x: 80, rotateY: 25 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  style={{ transform: 'translateZ(70px)' }}
                >
                  Minimalist
                  {/* Enhanced 3D Underline effect */}
                  <motion.div 
                    className="absolute -bottom-4 left-0 h-1 bg-gradient-to-r from-blue-400/0 via-blue-400/80 to-blue-400/0 rounded-full"
                    initial={{ width: 0, translateZ: -20 }}
                    animate={{ width: "100%", translateZ: 0 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                    style={{ transform: 'translateZ(30px)' }}
                  />
                </motion.span>
              </h1>
            </motion.div>
            
            {/* Enhanced 3D Tagline with Icons */}
            <motion.div 
              className="flex items-center justify-center space-x-12 text-white/60 preserve-3d"
              initial={{ opacity: 0, y: 50, translateZ: -60 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              <motion.div 
                className="flex items-center space-x-3 card-3d"
                whileHover={{ 
                  scale: 1.1, 
                  color: "#3b82f6",
                  translateZ: 25,
                  rotateY: 10
                }}
                transition={{ duration: 0.4 }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <Code size={24} />
                <span className="text-base font-light">Code</span>
              </motion.div>
              <div className="w-px h-8 bg-white/30" style={{ transform: 'translateZ(20px)' }} />
              <motion.div 
                className="flex items-center space-x-3 card-3d"
                whileHover={{ 
                  scale: 1.1, 
                  color: "#06b6d4",
                  translateZ: 25,
                  rotateY: -10
                }}
                transition={{ duration: 0.4 }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <Palette size={24} />
                <span className="text-base font-light">Design</span>
              </motion.div>
              <div className="w-px h-8 bg-white/30" style={{ transform: 'translateZ(20px)' }} />
              <motion.div 
                className="flex items-center space-x-3 card-3d"
                whileHover={{ 
                  scale: 1.1, 
                  color: "#0ea5e9",
                  translateZ: 25,
                  rotateY: 5
                }}
                transition={{ duration: 0.4 }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <Zap size={24} />
                <span className="text-base font-light">Experience</span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/70 font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-balance"
              initial={{ opacity: 0, y: 30, translateZ: -40 }}
              animate={{ opacity: 1, y: 0, translateZ: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ transform: 'translateZ(30px)' }}
            >
              Crafting purposeful digital experiences through thoughtful design and precise execution
            </motion.p>
          </div>

          {/* Enhanced 3D CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 40, translateZ: -80 }}
            animate={{ opacity: 1, y: 0, translateZ: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="preserve-3d"
          >
            <motion.button 
              onClick={scrollToWork}
              className="group relative inline-flex items-center space-x-4 bg-white/8 hover:bg-white/15 border-2 border-white/30 hover:border-white/60 text-white px-10 py-5 rounded-full font-medium backdrop-blur-sm btn-3d-enhanced focus-ring text-lg"
              whileHover={{ 
                scale: 1.08,
                translateZ: 30,
                rotateX: -8,
              }}
              whileTap={{ scale: 0.95, translateZ: 10 }}
              style={{ transform: 'translateZ(50px)' }}
            >
              <span>Explore Work</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={20} />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced 3D Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden sm:block preserve-3d"
        initial={{ opacity: 0, translateZ: -60 }}
        animate={{ opacity: 1, translateZ: 0 }}
        transition={{ delay: 2.5 }}
        style={{ transform: 'translateZ(60px)' }}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            className="w-0.5 h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent rounded-full"
            animate={{ 
              scaleY: [1, 0.6, 1],
              translateZ: [0, 10, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-white/40 font-light tracking-widest uppercase">Scroll</div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes grid-3d-move {
          0% { transform: translate(0, 0) translateZ(-150px) rotateX(15deg); }
          100% { transform: translate(120px, 120px) translateZ(-150px) rotateX(15deg); }
        }
      `}</style>
    </section>
  );
}