import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function Work() {
  const { ref, isVisible } = useScrollAnimation();
  const { ref: staggerRef, getItemDelay } = useStaggerAnimation(4, 0.2);

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

  return (
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Enhanced Background Elements with Parallax */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Additional Depth Elements */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/3 to-transparent rounded-full blur-3xl animate-pulse-minimal" />
      </div>

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Enhanced Header */}
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-extralight text-white leading-none tracking-tighter mb-8">
              Selected
              <span className="block gradient-text font-light mt-4">
                Work
              </span>
            </h2>
            <p className="text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
              A curated collection of projects that showcase the intersection of minimal design and functional excellence
            </p>
          </div>

          {/* Enhanced Projects with Stagger Animation */}
          <div ref={staggerRef} className="space-y-20">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                data-cursor="project"
                className={`group relative border-b border-white/10 pb-20 last:border-b-0 last:pb-0 transition-all duration-700 hover:border-blue-400/30 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-20'
                }`}
                style={{ 
                  animationDelay: `${getItemDelay(index)}s`,
                  transitionDelay: `${getItemDelay(index)}s`
                }}
              >
                {/* Enhanced Project Container */}
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start group-hover:translate-x-2 transition-transform duration-500">
                  
                  {/* Enhanced Project Number & Year */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="text-4xl md:text-5xl font-extralight text-white/20 leading-none group-hover:text-white/40 transition-colors duration-500">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/50 font-medium tracking-wider uppercase group-hover:text-blue-400/70 transition-colors duration-500">
                      {project.year}
                    </div>
                  </div>

                  {/* Enhanced Main Content */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Enhanced Title & Category */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-3xl md:text-4xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500">
                          {project.title}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 bg-white/5 text-white/70 text-sm font-medium rounded-full border border-white/10 w-fit group-hover:border-blue-400/30 group-hover:bg-blue-400/5 transition-all duration-500">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Description */}
                    <p className="text-lg text-white/70 leading-relaxed font-light group-hover:text-white/90 transition-colors duration-500">
                      {project.description}
                    </p>

                    {/* Enhanced Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-zinc-900/50 text-white/60 text-sm font-medium rounded-md border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-400/5"
                          style={{ transitionDelay: `${techIndex * 0.05}s` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Status & Action */}
                  <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-4">
                    {/* Enhanced Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        project.status === 'Live' 
                          ? 'bg-green-400 animate-pulse group-hover:shadow-glow-green' 
                          : 'bg-yellow-400 animate-pulse group-hover:shadow-glow-yellow'
                      }`} />
                      <span className="text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors duration-500">
                        {project.status}
                      </span>
                    </div>

                    {/* Enhanced View Project Link */}
                    <button 
                      className="group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-all duration-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-3 py-2 relative overflow-hidden"
                      aria-label={`View ${project.title} project details`}
                    >
                      {/* Button Background Effect */}
                      <div className="absolute inset-0 bg-blue-400/10 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
                      
                      <span className="text-sm relative z-10">View Project</span>
                      <ArrowUpRight size={14} className="relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Hover Line Effect */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-700" />
                
                {/* Subtle Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg -m-4" />
              </div>
            ))}
          </div>

          {/* Enhanced View All Projects */}
          <div className="text-center mt-32">
            <button className="group inline-flex items-center space-x-4 bg-transparent border border-white/20 hover:border-blue-400/50 text-white hover:text-blue-400 px-10 py-5 rounded-full font-medium transition-all duration-500 btn-minimal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black relative overflow-hidden">
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
              
              <span className="text-lg relative z-10">View All Projects</span>
              <ArrowUpRight size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}