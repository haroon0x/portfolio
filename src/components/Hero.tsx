import React, { useState, useEffect } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    'AI/ML Engineer',
    'Agentic AI Developer',
    'Full-Stack Developer',
    'Open Source Contributor'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWork = () => {
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/haroon0x' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/muhammed-haroon-0399962b8' },
    { name: 'Email', icon: Mail, url: 'mailto:haroonbmc0@gmail.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/skywalkerr0x' }
  ];

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#0a0a0a]">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 perspective-1000">
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
          }}
          animate={{
            rotateX: [0, 360],
            rotateZ: [0, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-accent/20"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${-mousePosition.y}deg) rotateY(${-mousePosition.x}deg)`,
          }}
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-white/5 rounded-lg"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mousePosition.x * 0.5}deg) rotateX(${mousePosition.y * 0.5}deg)`,
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Role Badge */}
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-white/70 font-mono">Available for opportunities</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Building the Future
              <br />
              <span className="text-accent">with Intelligence</span>
            </motion.h1>

            {/* Rotating Role */}
            <motion.div
              className="h-12 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.p
                key={currentRole}
                className="text-xl sm:text-2xl md:text-3xl text-white/60 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {roles[currentRole]}
              </motion.p>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Creating intelligent systems and building agents that solve real-world problems.
            Passionate about AI, open-source, and pushing the boundaries of what's possible.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.button
              onClick={scrollToWork}
              className="group px-8 py-4 bg-accent text-black font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View My Work</span>
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </motion.button>

            <motion.a
              href="https://github.com/haroon0x"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 text-white hover:border-accent hover:text-accent font-medium rounded-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Projects
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-6 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-white/40 hover:text-accent transition-colors duration-300 rounded-lg hover:bg-white/5"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                aria-label={social.name}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToWork}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
          <span className="text-xs text-white/30 uppercase tracking-wider font-mono group-hover:text-accent transition-colors">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}