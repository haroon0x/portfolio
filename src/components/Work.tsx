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
    hidden: { opacity: 0, y: 30, translateZ: -50 },
    visible: {
      opacity: 1,
      y: 0,
      translateZ: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden perspective-1000">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 preserve-3d">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float-3d"
          style={{ transform: 'translateZ(-30px)' }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-float-3d"
          style={{ 
            transform: 'translateZ(-20px)',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="preserve-3d"
        >
          {/* Header with 3D Effect */}
          <motion.div 
            className="text-center mb-16 sm:mb-24 lg:mb-32 preserve-3d"
            variants={itemVariants}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter mb-6 sm:mb-8 text-3d"
                style={{ transform: 'translateZ(30px)' }}>
              Selected
              <span className="block gradient-text font-light mt-2 sm:mt-4 text-3d-glow"
                    style={{ transform: 'translateZ(40px)' }}>
                Work
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance px-4"
               style={{ transform: 'translateZ(20px)' }}>
              A curated collection of projects that showcase the intersection of minimal design and functional excellence
            </p>
          </motion.div>

          {/* Projects with 3D Cards */}
          <motion.div 
            className="space-y-12 sm:space-y-16 lg:space-y-20 preserve-3d"
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.title}
                className="group relative border-b border-white/10 pb-12 sm:pb-16 lg:pb-20 last:border-b-0 last:pb-0 transition-all duration-700 hover:border-blue-400/30 card-3d preserve-3d"
                variants={itemVariants}
                whileHover={{ 
                  x: 4,
                  translateZ: 20,
                  rotateY: 2
                }}
                style={{ transform: 'translateZ(0px)' }}
              >
                <div className="grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-start">
                  
                  {/* Project Number with 3D Effect */}
                  <div className="md:col-span-2 space-y-3 sm:space-y-4 preserve-3d">
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-white/20 leading-none group-hover:text-white/40 transition-all duration-500 text-3d"
                      whileHover={{ 
                        scale: 1.1,
                        translateZ: 15,
                        rotateY: 10
                      }}
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/50 font-medium tracking-wider uppercase group-hover:text-blue-400/70 transition-colors duration-500"
                         style={{ transform: 'translateZ(5px)' }}>
                      {project.year}
                    </div>
                  </div>

                  {/* Main Content with 3D Layers */}
                  <div className="md:col-span-7 space-y-4 sm:space-y-6 preserve-3d">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <motion.h3 
                          className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500 text-3d"
                          whileHover={{ 
                            x: 4,
                            translateZ: 10
                          }}
                          style={{ transform: 'translateZ(15px)' }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.span 
                          className="inline-flex items-center px-3 py-1 bg-white/5 text-white/70 text-xs sm:text-sm font-medium rounded-full border border-white/10 w-fit group-hover:border-blue-400/30 group-hover:bg-blue-400/5 transition-all duration-500 card-layers"
                          whileHover={{ 
                            scale: 1.05,
                            translateZ: 8
                          }}
                          style={{ transform: 'translateZ(8px)' }}
                        >
                          {project.category}
                        </motion.span>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-500 text-pretty"
                       style={{ transform: 'translateZ(12px)' }}>
                      {project.description}
                    </p>

                    {/* Tech Stack with 3D Hover */}
                    <div className="flex flex-wrap gap-2 preserve-3d">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span 
                          key={tech}
                          className="px-2 sm:px-3 py-1 bg-zinc-900/50 text-white/60 text-xs sm:text-sm font-medium rounded-md border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-400/5 card-layers"
                          whileHover={{ 
                            scale: 1.05, 
                            y: -2,
                            translateZ: 5
                          }}
                          transition={{ delay: techIndex * 0.05 }}
                          style={{ transform: 'translateZ(6px)' }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Action with 3D Effects */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 sm:space-y-4 preserve-3d">
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                          project.status === 'Live' 
                            ? 'bg-green-400 shadow-glow-green' 
                            : 'bg-yellow-400 shadow-glow-yellow'
                        }`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                          translateZ: [0, 3, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ transform: 'translateZ(8px)' }}
                      />
                      <span className="text-xs sm:text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors duration-500"
                            style={{ transform: 'translateZ(5px)' }}>
                        {project.status}
                      </span>
                    </div>

                    <motion.button 
                      className="group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus-ring rounded-lg px-3 py-2 text-xs sm:text-sm btn-3d"
                      whileHover={{ 
                        x: 4, 
                        y: -2,
                        translateZ: 10,
                        rotateY: -5
                      }}
                      aria-label={`View ${project.title} project details`}
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      <span>View Project</span>
                      <ArrowUpRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                    </motion.button>
                  </div>
                </div>

                {/* 3D Hover Effects */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400"
                  initial={{ width: 0, translateZ: -5 }}
                  whileHover={{ 
                    width: "100%",
                    translateZ: 0
                  }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-cyan-500/2 rounded-lg -m-2 sm:-m-4"
                  initial={{ opacity: 0, translateZ: -10 }}
                  whileHover={{ 
                    opacity: 1,
                    translateZ: -5
                  }}
                  transition={{ duration: 0.7 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Projects with 3D Button */}
          <motion.div 
            className="text-center mt-16 sm:mt-24 lg:mt-32 preserve-3d"
            variants={itemVariants}
          >
            <Link to="/projects">
              <motion.button
                className="group inline-flex items-center space-x-3 sm:space-x-4 bg-transparent border border-white/20 hover:border-blue-400/50 text-white hover:text-blue-400 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full font-medium btn-3d focus-ring text-base sm:text-lg"
                whileHover={{ 
                  scale: 1.05,
                  translateZ: 15,
                  rotateX: -3
                }}
                whileTap={{ 
                  scale: 0.95,
                  translateZ: 5
                }}
                style={{ transform: 'translateZ(20px)' }}
              >
                <span>View All Projects</span>
                <motion.div
                  whileHover={{ 
                    x: 4, 
                    y: -4,
                    translateZ: 5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}