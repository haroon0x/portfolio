import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Work({ order }: { order: 'relevancy' | 'latest' }) {
  const { ref, isVisible } = useScrollAnimation();

  const baseProjects = [
    {
      title: 'Containerized Agent',
      category: 'AI/ML',
      description: 'A secure, containerized code execution agent with shell, GUI, and orchestration support. Features isolated environments for safe code execution.',
      year: '2025',
      tech: ['Python', 'Docker', 'Containerization', 'Security'],
      status: 'Development',
      githubUrl: 'https://github.com/haroon0x/Containerized-agent',
      liveUrl: null
    },
    {
      title: 'CrawlWise - The GEOAgent',
      category: 'Web Development',
      description: 'An intelligent web crawling agent that discovers marketing opportunities and generates tailored content for SEO optimization.',
      year: '2025',
      tech: ['TypeScript', 'React', 'AI/ML', 'Web Crawling'],
      status: 'Live',
      githubUrl: 'https://github.com/haroon0x/CrawlWise',
      liveUrl: 'https://crawlwise.netlify.app/'
    },
    {
      title: 'PromoAgent',
      category: 'AI/ML',
      description: 'An autonomous agent built with LangGraph that discovers marketing opportunities on Reddit and generates tailored content without getting blocked.',
      year: '2025',
      tech: ['Python', 'LangGraph', 'AI/ML', 'Marketing'],
      status: 'Live',
      githubUrl: 'https://github.com/haroon0x/PromoAgent',
      liveUrl: 'https://promoagent.onrender.com/'
    },
    {
      title: 'TheAgent - CLI Code Agent',
      category: 'Development Tools',
      description: 'A CLI Code Agent for automated Python code documentation, migration, refactoring, and analysis with intelligent code processing.',
      year: '2025',
      tech: ['Python', 'CLI', 'Code Analysis', 'Automation'],
      status: 'Development',
      githubUrl: 'https://github.com/haroon0x/TheAgent',
      liveUrl: null
    },
    {
      title: 'Percolation Hypotheses Generator',
      category: 'AI/ML Research',
      description: 'A hypothesis generation engine exploring the relationship between hypothesis complexity and information density, with a dual-framework for information-theoretic and scientific quality analysis.',
      year: '2025',
      tech: ['Python', 'NLP', 'Information Theory', 'Research'],
      status: 'Alpha',
      githubUrl: 'https://github.com/haroon0x/percolation-hypotheses-gen',
      liveUrl: 'https://percolation-hypotheses.onrender.com/'
    },
    {
      title: 'WeCode-Ai-Learning',
      category: 'AI/ML EdTech',
      description: 'GENAI-powered teaching assistant for Data Structures and Algorithms. Features adaptive learning methods (Socratic, Feynman, custom), dynamic user expertise assessment, and a multi-model AI architecture.',
      year: '2023',
      tech: ['Python', 'React', 'Flask', 'AI/ML', 'EdTech'],
      status: 'Live',
      githubUrl: 'https://github.com/haroon0x/WeCode-Ai-Learning',
      liveUrl: 'https://wecode-ai-learning.onrender.com/'
    },
    {
      title: 'Neural Network From Scratch',
      category: 'Machine Learning',
      description: 'Educational project implementing neural networks from scratch in both Python and Java, focusing on core concepts, forward/backward propagation, and optimization without high-level libraries.',
      year: '2024',
      tech: ['Python', 'Java', 'Neural Networks', 'ML Fundamentals'],
      status: 'Learning',
      githubUrl: 'https://github.com/haroon0x/NNFromScratch',
      liveUrl: null
    }
  ];

  const projects = order === 'latest'
    ? [...baseProjects].sort((a, b) => b.year.localeCompare(a.year))
    : baseProjects;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={ref as React.RefObject<HTMLDivElement>}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-16 sm:mb-24 lg:mb-32"
            variants={itemVariants}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter mb-6 sm:mb-8">
              Proof of
              <span className="block gradient-text font-light mt-2 sm:mt-4">
                Work
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance px-4">
              A showcase of AI/ML projects and intelligent systems I've built-from containerized agents to autonomous tools.
            </p>
          </motion.div>

          {/* Projects */}
          <AnimatePresence mode="wait">
          <motion.div 
              key={order}
            className="space-y-12 sm:space-y-16 lg:space-y-20"
            variants={containerVariants}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'anticipate' }}
          >
            {projects.map((project, index) => (
                <a
                  key={project.title}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative border-b border-white/10 pb-12 sm:pb-16 lg:pb-20 last:border-b-0 last:pb-0 transition-all duration-700 hover:border-blue-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  style={{ textDecoration: 'none' }}
                >
              <motion.div 
                variants={itemVariants}
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <div className="grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-start">
                  {/* Project Number */}
                  <div className="md:col-span-2 space-y-3 sm:space-y-4">
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-white/20 leading-none group-hover:text-white/40 transition-all duration-500"
                      whileHover={{ scale: 1.1 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/50 font-medium tracking-wider uppercase group-hover:text-blue-400/70 transition-colors duration-500">
                      {project.year}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="md:col-span-7 space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <motion.h3 
                          className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500"
                          whileHover={{ x: 4 }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.span 
                          className="inline-flex items-center px-3 py-1 bg-white/5 text-white/70 text-xs sm:text-sm font-medium rounded-full border border-white/10 w-fit group-hover:border-blue-400/30 group-hover:bg-blue-400/5 transition-all duration-500"
                          whileHover={{ scale: 1.05 }}
                        >
                          {project.category}
                        </motion.span>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-500 text-pretty">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span 
                          key={tech}
                          className="px-2 sm:px-3 py-1 bg-zinc-900/50 text-white/60 text-xs sm:text-sm font-medium rounded-md border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-400/5"
                          whileHover={{ scale: 1.08, y: -2 }}
                          transition={{ delay: techIndex * 0.04, type: 'spring', stiffness: 180, damping: 20 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                          project.status === 'Live' 
                            ? 'bg-green-400' 
                            : 'bg-yellow-400'
                        }`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <span className="text-xs sm:text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors duration-500">
                        {project.status}
                      </span>
                    </div>

                      <div className="flex items-center space-x-2">
                        {project.githubUrl && (
                          <motion.span 
                            className="pointer-events-none group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus-ring rounded-lg px-3 py-2 text-xs sm:text-sm"
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                          >
                            <Github size={12} className="sm:w-[14px] sm:h-[14px]" />
                            <span>Code</span>
                          </motion.span>
                        )}
                        {project.liveUrl && (
                          <motion.a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                      className="group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus-ring rounded-lg px-3 py-2 text-xs sm:text-sm"
                      whileHover={{ x: 4, y: -2 }}
                            aria-label={`View ${project.title} live demo`}
                            onClick={e => e.stopPropagation()}
                    >
                            <span>Live</span>
                            <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px]" />
                          </motion.a>
                        )}
                      </div>
                  </div>
                </div>

                {/* Hover Effects */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-cyan-500/2 rounded-lg -m-2 sm:-m-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                />
              </motion.div>
              </a>
            ))}
          </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}