import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Work() {
  const { ref, isVisible } = useScrollAnimation();

  const projects = [
    {
      title: 'Minimal Banking',
      category: 'Fintech',
      description: 'Clean, intuitive banking interface focused on user experience and accessibility.',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2024',
      tech: ['React', 'TypeScript', 'Tailwind']
    },
    {
      title: 'Studio Portfolio',
      category: 'Creative',
      description: 'Elegant portfolio showcasing architectural photography with minimal design principles.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2024',
      tech: ['Next.js', 'Framer Motion', 'GSAP']
    },
    {
      title: 'Health Dashboard',
      category: 'Healthcare',
      description: 'Comprehensive health monitoring platform with clean data visualization.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2023',
      tech: ['Vue.js', 'D3.js', 'Node.js']
    },
    {
      title: 'E-Commerce Minimal',
      category: 'Retail',
      description: 'Streamlined shopping experience with focus on product presentation and usability.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2023',
      tech: ['React', 'Shopify', 'Stripe']
    }
  ];

  return (
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-extralight text-white leading-none tracking-tighter mb-8">
              Selected
              <span className="block gradient-text font-light mt-4">
                Work
              </span>
            </h2>
            <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
              A curated collection of projects that showcase the intersection of minimal design and functional excellence
            </p>
          </div>

          {/* Projects Grid - New Masonry-style Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className={`group relative ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                } ${index === 1 ? 'lg:row-span-2' : ''} ${
                  isVisible ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Project Card */}
                <div className="relative h-full bg-zinc-950/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden group-hover:border-blue-400/30 transition-all duration-700 card-minimal">
                  {/* Image Container */}
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'aspect-[16/9]' : index === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'
                  }`}>
                    <img 
                      src={project.image} 
                      alt={`${project.title} project`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Hover Actions */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <button 
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={`View ${project.title} project`}
                      >
                        <ExternalLink size={18} className="text-white" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white/80 text-xs font-medium rounded-full border border-white/20">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    {/* Title & Year */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500">
                          {project.title}
                        </h3>
                        <span className="text-white/40 text-sm font-medium">
                          {project.year}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-white/70 leading-relaxed font-light text-sm md:text-base">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 bg-white/5 text-white/60 text-xs font-medium rounded-full border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View Project Link */}
                    <button 
                      className="group/btn inline-flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-colors duration-300 font-medium pt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg px-3 py-2"
                      aria-label={`View ${project.title} project details`}
                    >
                      <span className="text-sm">View Project</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects */}
          <div className="text-center mt-20">
            <button className="group inline-flex items-center space-x-3 bg-transparent border border-white/20 hover:border-blue-400/50 text-white hover:text-blue-400 px-8 py-4 rounded-full font-medium transition-all duration-500 btn-minimal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <span>View All Projects</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}