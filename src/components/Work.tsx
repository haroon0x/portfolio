import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Work() {
  const { ref, isVisible } = useScrollAnimation();

  const projects = [
    {
      title: 'Minimal Banking',
      category: 'Fintech',
      description: 'Clean, intuitive banking interface focused on user experience and accessibility. Designed to simplify complex financial data into digestible, actionable insights.',
      year: '2024',
      tech: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
      status: 'Live'
    },
    {
      title: 'Studio Portfolio',
      category: 'Creative',
      description: 'Elegant portfolio showcasing architectural photography with minimal design principles. Every element carefully crafted to highlight the beauty of space and form.',
      year: '2024',
      tech: ['Next.js', 'Framer Motion', 'GSAP', 'Sanity'],
      status: 'Live'
    },
    {
      title: 'Health Dashboard',
      category: 'Healthcare',
      description: 'Comprehensive health monitoring platform with clean data visualization. Transforming complex medical data into clear, understandable visual narratives.',
      year: '2023',
      tech: ['Vue.js', 'D3.js', 'Node.js', 'MongoDB'],
      status: 'Development'
    },
    {
      title: 'E-Commerce Minimal',
      category: 'Retail',
      description: 'Streamlined shopping experience with focus on product presentation and usability. Reducing friction in the customer journey while maintaining visual elegance.',
      year: '2023',
      tech: ['React', 'Shopify', 'Stripe', 'GraphQL'],
      status: 'Live'
    }
  ];

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
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
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

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-32"
            variants={itemVariants}
          >
            <h2 className="text-fluid-5xl font-extralight text-white leading-none tracking-tighter mb-8">
              Selected
              <span className="block gradient-text font-light mt-4">
                Work
              </span>
            </h2>
            <p className="text-fluid-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance">
              A curated collection of projects that showcase the intersection of minimal design and functional excellence
            </p>
          </motion.div>

          {/* Projects */}
          <motion.div 
            className="space-y-20"
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.title}
                className="group relative border-b border-white/10 pb-20 last:border-b-0 last:pb-0 transition-all duration-700 hover:border-blue-400/30"
                variants={itemVariants}
                whileHover={{ x: 8 }}
              >
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                  
                  {/* Project Number */}
                  <div className="md:col-span-2 space-y-4">
                    <motion.div 
                      className="text-fluid-3xl font-extralight text-white/20 leading-none group-hover:text-white/40 transition-all duration-500"
                      whileHover={{ scale: 1.1 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                    <div className="text-sm text-white/50 font-medium tracking-wider uppercase group-hover:text-blue-400/70 transition-colors duration-500">
                      {project.year}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <motion.h3 
                          className="text-fluid-2xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500"
                          whileHover={{ x: 4 }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.span 
                          className="inline-flex items-center px-3 py-1 bg-white/5 text-white/70 text-sm font-medium rounded-full border border-white/10 w-fit group-hover:border-blue-400/30 group-hover:bg-blue-400/5 transition-all duration-500"
                          whileHover={{ scale: 1.05 }}
                        >
                          {project.category}
                        </motion.span>
                      </div>
                    </div>
                    
                    <p className="text-fluid-base text-white/70 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-500 text-pretty">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span 
                          key={tech}
                          className="px-3 py-1 bg-zinc-900/50 text-white/60 text-sm font-medium rounded-md border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-400/5"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ delay: techIndex * 0.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-4">
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          project.status === 'Live' 
                            ? 'bg-green-400 shadow-glow-green' 
                            : 'bg-yellow-400 shadow-glow-yellow'
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
                      <span className="text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors duration-500">
                        {project.status}
                      </span>
                    </div>

                    <motion.button 
                      className="group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus-ring rounded-lg px-3 py-2"
                      whileHover={{ x: 4, y: -2 }}
                      aria-label={`View ${project.title} project details`}
                    >
                      <span className="text-sm">View Project</span>
                      <ArrowUpRight size={14} />
                    </motion.button>
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
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-cyan-500/2 rounded-lg -m-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Projects */}
          <motion.div 
            className="text-center mt-32"
            variants={itemVariants}
          >
            <Link to="/projects">
              <motion.button
                className="group inline-flex items-center space-x-4 bg-transparent border border-white/20 hover:border-blue-400/50 text-white hover:text-blue-400 px-10 py-5 rounded-full font-medium btn-modern focus-ring"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">View All Projects</span>
                <motion.div
                  whileHover={{ x: 4, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight size={18} />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}