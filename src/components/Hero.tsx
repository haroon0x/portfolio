import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x', color: 'hover:text-white' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8', color: 'hover:text-blue-400' },
    { name: 'Email', icon: Mail, url: 'mailto:haroonbmc0@gmail.com', color: 'hover:text-green-400' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/skywalkerr0x', color: 'hover:text-blue-400' }
  ];

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ 
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
        
        {/* Minimal Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          className="space-y-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main Title */}
          <div className="space-y-8">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-none tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span 
                className="block text-white mb-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                AI/ML
              </motion.span>
              <motion.span 
                className="block gradient-text font-light"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Engineer
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-white/60 font-light tracking-wide max-w-4xl mx-auto leading-relaxed text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Exploring deep neural nets and building intelligent systems. 
              <br />
              <span className="text-white/80">AI/ML Engineer • Open Source Contributor</span>
            </motion.p>
          </div>

          {/* Skills/Tech Stack */}
          <motion.div 
            className="flex items-center justify-center space-x-8 text-white/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="text-center">
              <div className="text-2xl font-light text-white/80 mb-1">Python</div>
              <div className="text-xs uppercase tracking-wider">AI/ML</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-light text-white/80 mb-1">React</div>
              <div className="text-xs uppercase tracking-wider">Frontend</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-light text-white/80 mb-1">Docker</div>
              <div className="text-xs uppercase tracking-wider">DevOps</div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 text-white/60 ${social.color} transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg`}
                whileHover={{ y: -2 }}
                aria-label={`Visit ${social.name} profile`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <motion.button 
              onClick={scrollToWork}
              className="group inline-flex items-center space-x-3 bg-white hover:bg-white/90 text-black px-8 py-4 rounded-full font-medium btn-modern focus-ring text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View my work"
            >
              <span>View Proof of Work</span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Minimal Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <motion.div 
            className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"
            animate={{ scaleY: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="text-xs text-white/30 font-light tracking-wider uppercase">Scroll</div>
        </div>
      </motion.div>
    </section>
  );
}