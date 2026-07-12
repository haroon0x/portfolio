import React, { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ROLES = [
  'AI/ML Engineer',
  'Agentic AI Developer',
  'Open Source Contributor'
];

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(sy, (v) => v);
  const rotateY = useTransform(sx, (v) => v);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 20);
      my.set((e.clientY / window.innerHeight - 0.5) * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mx, my]);

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
    { name: 'Sponsor', icon: Heart, url: 'https://github.com/sponsors/haroon0x' }
  ];

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-transparent px-4 py-24 sm:px-6 sm:py-28">
      {/* Single floating geometric shape */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          className="absolute left-6 top-28 h-16 w-16 border border-border opacity-40 sm:left-1/4 sm:top-1/4 md:h-32 md:w-32"
          style={{
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Role Badge */}
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 sm:px-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
              <span className="min-w-0 font-mono text-xs text-text-secondary sm:text-sm">Open to full-time & freelance work</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              className="text-display font-medium text-text-primary leading-[0.98] tracking-tight text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            >
              Building Intelligent
              <br />
              <span className="text-accent font-light">Systems</span>
            </motion.h1>

            {/* Rotating Role with AnimatePresence */}
            <div className="flex min-h-12 items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={currentRole}
                  className="text-heading text-text-secondary font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {ROLES[currentRole]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <motion.p
            className="mx-auto max-w-2xl text-body-lg text-text-secondary font-light text-pretty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          >
            Creating intelligent systems and building agents that solve real-world problems.
            Passionate about AI, open-source, and pushing the boundaries of what's possible.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/pull-requests"
                onMouseEnter={() => import('../pages/PullRequests')}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-white shadow-lg shadow-accent/20 transition-[background-color,box-shadow,transform] duration-base hover:bg-accent-hover hover:shadow-accent/40 active:scale-[0.96] sm:px-8 sm:py-4"
              >
                <span>View My Work</span>
                <ArrowDown size={18} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.a
              href="https://github.com/haroon0x"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-border px-6 py-3.5 font-medium text-text-primary transition-[color,border-color,transform] duration-base hover:border-accent hover:text-accent active:scale-[0.96] sm:w-auto sm:px-8 sm:py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              Explore Projects
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-3 pt-4 sm:gap-6 sm:pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-3 text-text-muted transition-colors duration-base hover:bg-hover-bg hover:text-accent"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.025, ease: EASE }}
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
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 transform sm:block md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
      >
        <motion.button
          type="button"
          aria-label="Scroll to work section"
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToWork}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
          <span className="text-xs text-text-muted uppercase tracking-wider font-mono group-hover:text-accent transition-colors">Scroll</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
