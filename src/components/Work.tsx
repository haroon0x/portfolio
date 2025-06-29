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
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, translateZ: -100 },
    visible: {
      opacity: 1,
      y: 0,
      translateZ: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32 bg-black relative overflow-hidden perspective-2000">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 preserve-3d">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float-3d-enhanced"
          style={{ transform: 'translateZ(-80px)' }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-3d-enhanced"
          style={{ 
            transform: 'translateZ(-60px)',
            animationDelay: '3s'
          }}
        />
        
        {/* Additional 3D geometric shapes */}
        <motion.div 
          className="absolute top-1/3 left-1/6 w-16 h-16 border border-white/10 rounded-lg animate-rotate-3d-enhanced"
          style={{ transform: 'translateZ(-40px)' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl animate-rotate-3d-enhanced"
          style={{ 
            transform: 'translateZ(-50px)',
            animationDelay: '5s'
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
          {/* Enhanced Header with 3D Effect */}
          <motion.div 
            className="text-center mb-16 sm:mb-24 lg:mb-32 preserve-3d"
            variants={itemVariants}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-none tracking-tighter mb-6 sm:mb-8 text-3d-enhanced"
                style={{ transform: 'translateZ(60px)' }}>
              Selected
              <span className="block gradient-text font-light mt-2 sm:mt-4 text-3d-glow-enhanced"
                    style={{ transform: 'translateZ(80px)' }}>
                Work
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance px-4"
               style={{ transform: 'translateZ(40px)' }}>
              A curated collection of projects that showcase the intersection of minimal design and functional excellence
            </p>
          </motion.div>

          {/* Enhanced Projects with 3D Cards */}
          <motion.div 
            className="space-y-12 sm:space-y-16 lg:space-y-20 preserve-3d"
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <motion.div 
                key={project.title}
                className="group relative border-b border-white/10 pb-12 sm:pb-16 lg:pb-20 last:border-b-0 last:pb-0 transition-all duration-700 hover:border-blue-400/30 card-3d card-layers-enhanced preserve-3d"
                variants={itemVariants}
                whileHover={{ 
                  x: 8,
                  translateZ: 40,
                  rotateY: 3,
                  scale: 1.02
                }}
                style={{ transform: 'translateZ(0px)' }}
              >
                <div className="grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-start">
                  
                  {/* Enhanced Project Number with 3D Effect */}
                  <div className="md:col-span-2 space-y-3 sm:space-y-4 preserve-3d">
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-white/20 leading-none group-hover:text-white/50 transition-all duration-500 text-3d-enhanced"
                      whileHover={{ 
                        scale: 1.2,
                        translateZ: 30,
                        rotateY: 15,
                        color: "rgba(59, 130, 246, 0.4)"
                      }}
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-white/50 font-medium tracking-wider uppercase group-hover:text-blue-400/70 transition-colors duration-500"
                         style={{ transform: 'translateZ(15px)' }}>
                      {project.year}
                    </div>
                  </div>

                  {/* Enhanced Main Content with 3D Layers */}
                  <div className="md:col-span-7 space-y-4 sm:space-y-6 preserve-3d">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <motion.h3 
                          className="text-xl sm:text-2xl md:text-3xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500 text-3d-enhanced"
                          whileHover={{ 
                            x: 8,
                            translateZ: 20,
                            scale: 1.05
                          }}
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          {project.title}
                        </motion.h3>
                        <motion.span 
                          className="inline-flex items-center px-4 py-2 bg-white/8 text-white/70 text-xs sm:text-sm font-medium rounded-full border border-white/20 w-fit group-hover:border-blue-400/40 group-hover:bg-blue-400/10 transition-all duration-500 card-layers-enhanced"
                          whileHover={{ 
                            scale: 1.1,
                            translateZ: 15,
                            rotateX: 5
                          }}
                          style={{ transform: 'translateZ(20px)' }}
                        >
                          {project.category}
                        </motion.span>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-500 text-pretty"
                       style={{ transform: 'translateZ(25px)' }}>
                      {project.description}
                    </p>

                    {/* Enhanced Tech Stack with 3D Hover */}
                    <div className="flex flex-wrap gap-3 preserve-3d">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span 
                          key={tech}
                          className="px-3 py-2 bg-zinc-900/60 text-white/60 text-xs sm:text-sm font-medium rounded-lg border border-white/15 hover:border-white/30 transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-400/10 card-layers-enhanced"
                          whileHover={{ 
                            scale: 1.1, 
                            y: -4,
                            translateZ: 12,
                            rotateX: 5
                          }}
                          transition={{ delay: techIndex * 0.05 }}
                          style={{ transform: 'translateZ(18px)' }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Status & Action with 3D Effects */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 sm:space-y-4 preserve-3d">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          project.status === 'Live' 
                            ? 'bg-green-400 shadow-glow-green' 
                            : 'bg-yellow-400 shadow-glow-yellow'
                        }`}
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [0.7, 1, 0.7],
                          translateZ: [0, 8, 0]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ transform: 'translateZ(20px)' }}
                      />
                      <span className="text-xs sm:text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors duration-500"
                            style={{ transform: 'translateZ(15px)' }}>
                        {project.status}
                      </span>
                    </div>

                    <motion.button 
                      className="group/btn inline-flex items-center space-x-3 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus-ring rounded-lg px-4 py-3 text-xs sm:text-sm btn-3d-enhanced border border-white/10 hover:border-blue-400/30"
                      whileHover={{ 
                        x: 8, 
                        y: -4,
                        translateZ: 20,
                        rotateY: -8,
                        scale: 1.05
                      }}
                      aria-label={`View ${project.title} project details`}
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      <span>View Project</span>
                      <ArrowUpRight size={14} />
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced 3D Hover Effects */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                  initial={{ width: 0, translateZ: -10 }}
                  whileHover={{ 
                    width: "100%",
                    translateZ: 5,
                    height: "2px"
                  }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl -m-4"
                  initial={{ opacity: 0, translateZ: -20 }}
                  whileHover={{ 
                    opacity: 1,
                    translateZ: -10,
                    scale: 1.02
                  }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced View All Projects with 3D Button */}
          <motion.div 
            className="text-center mt-16 sm:mt-24 lg:mt-32 preserve-3d"
            variants={itemVariants}
          >
            <Link to="/projects">
              <motion.button
                className="group inline-flex items-center space-x-4 bg-transparent border-2 border-white/30 hover:border-blue-400/60 text-white hover:text-blue-400 px-8 py-5 rounded-full font-medium btn-3d-enhanced focus-ring text-base sm:text-lg"
                whileHover={{ 
                  scale: 1.08,
                  translateZ: 30,
                  rotateX: -5
                }}
                whileTap={{ 
                  scale: 0.95,
                  translateZ: 10
                }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <span>View All Projects</span>
                <motion.div
                  whileHover={{ 
                    x: 6, 
                    y: -6,
                    translateZ: 10
                  }}
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