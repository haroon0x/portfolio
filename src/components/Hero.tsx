import React, { useState, useEffect } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ROLES = [
  'AI/ML Engineer',
  'Agentic AI Developer',
  'Open Source Contributor'
];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
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
    { name: 'Sponsor', icon: Heart, url: 'https://github.com/sponsors/haroon0x' }
  ];

  const stagger = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-transparent px-4 py-24 sm:px-6 sm:py-28">
      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <div className="space-y-6 sm:space-y-8">
          {/* Role Badge */}
          <motion.div
            className="inline-block"
            custom={0}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface border border-border shadow-petal px-3 py-2 sm:px-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse" />
              <span className="min-w-0 text-xs text-ink-secondary font-mono sm:text-sm">Open to full-time & freelance work</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              className="relative inline-block font-heading text-display text-ink text-balance"
              custom={1}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              Building Intelligent
              <br />
              <span className="text-accent relative">
                Systems
                {/* Hand-drawn gold underline */}
                <svg
                  viewBox="0 0 200 12"
                  className="absolute -bottom-2 left-0 w-full h-3"
                  aria-hidden="true"
                  style={{ width: '100%' }}
                >
                  <path
                    d="M3 9 C60 3 140 3 197 7"
                    stroke="#a8821f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              {/* Japanese caption — lg+ only */}
              <span
                aria-hidden="true"
                className="hidden lg:block absolute -left-10 top-2 font-heading text-sm text-ink-muted tracking-[0.3em]"
                style={{ writingMode: 'vertical-rl' }}
              >
                白百合の庭
              </span>
            </motion.h1>

            {/* Rotating Role */}
            <motion.div
              className="flex min-h-12 items-center justify-center"
              custom={2}
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={currentRole}
                  className="text-heading text-ink-secondary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ROLES[currentRole]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            className="mx-auto max-w-2xl text-body-lg text-ink-secondary text-pretty"
            custom={3}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            Creating intelligent systems and building agents that solve real-world problems.
            Passionate about AI, open-source, and pushing the boundaries of what's possible.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 sm:pt-4"
            custom={4}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/pull-requests"
                onMouseEnter={() => import('../pages/PullRequests')}
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-medium text-white shadow-petal transition-[background-color,box-shadow,transform] duration-300 hover:bg-accent-hover active:scale-[0.96] sm:px-8 sm:py-4"
              >
                <span>View My Work</span>
                <ArrowDown size={18} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.a
              href="https://github.com/haroon0x"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 font-medium text-ink transition-[color,border-color,transform] duration-300 hover:text-accent hover:border-accent active:scale-[0.96] sm:w-auto sm:px-8 sm:py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              Explore Projects
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-3 pt-4 sm:gap-6 sm:pt-8"
            custom={5}
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-3 text-ink-muted transition-colors duration-300 hover:text-accent hover:bg-accent-muted"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                custom={5 + index}
                variants={stagger}
                aria-label={social.name}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 transform sm:block md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
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
          <span className="text-xs text-ink-muted uppercase tracking-wider font-mono group-hover:text-accent transition-colors">Scroll</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
