import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Work() {
  const { ref, isVisible } = useScrollAnimation();

  const projects = [
    {
      title: 'Minimal Banking',
      category: 'Fintech',
      description: 'Clean, intuitive banking interface focused on user experience and accessibility. Designed to simplify complex financial data into digestible, actionable insights.',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1200',
      year: '2024',
      tech: ['React', 'TypeScript', 'Tailwind', 'Framer Motion']
    },
    {
      title: 'Studio Portfolio',
      category: 'Creative',
      description: 'Elegant portfolio showcasing architectural photography with minimal design principles. Every element carefully crafted to highlight the beauty of space and form.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
      year: '2024',
      tech: ['Next.js', 'Framer Motion', 'GSAP', 'Sanity']
    },
    {
      title: 'Health Dashboard',
      category: 'Healthcare',
      description: 'Comprehensive health monitoring platform with clean data visualization. Transforming complex medical data into clear, understandable visual narratives.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=1200',
      year: '2023',
      tech: ['Vue.js', 'D3.js', 'Node.js', 'MongoDB']
    },
    {
      title: 'E-Commerce Minimal',
      category: 'Retail',
      description: 'Streamlined shopping experience with focus on product presentation and usability. Reducing friction in the customer journey while maintaining visual elegance.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
      year: '2023',
      tech: ['React', 'Shopify', 'Stripe', 'GraphQL']
    }
  ];

  return (
    <section id="work" className="py-32 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Header */}
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

          {/* Projects - Vertical Stack */}
          <div className="space-y-32">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className={`group relative ${
                  isVisible ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Container */}
                <div className="relative">
                  {/* Project Number */}
                  <div className="absolute -left-4 md:-left-8 top-0 z-10">
                    <span className="text-6xl md:text-8xl font-extralight text-white/10 leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Main Project Card */}
                  <div className="relative bg-zinc-950/30 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden group-hover:border-blue-400/30 transition-all duration-700 card-minimal">
                    
                    {/* Image Section */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={`${project.title} project`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Hover Actions */}
                      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <button 
                          className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          aria-label={`View ${project.title} project`}
                        >
                          <ExternalLink size={20} className="text-white" />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-8 left-8">
                        <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white/90 text-sm font-medium rounded-full border border-white/20">
                          {project.category}
                        </span>
                      </div>

                      {/* Year Badge */}
                      <div className="absolute bottom-8 right-8">
                        <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-white/90 text-sm font-medium rounded-full border border-white/20">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 space-y-8">
                      {/* Title */}
                      <h3 className="text-4xl md:text-5xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500">
                        {project.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light max-w-3xl">
                        {project.description}
                      </p>

                      {/* Bottom Section */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 pt-4">
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-3">
                          {project.tech.map((tech) => (
                            <span 
                              key={tech}
                              className="px-4 py-2 bg-white/5 text-white/60 text-sm font-medium rounded-full border border-white/10 hover:border-white/20 transition-colors duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* View Project Link */}
                        <button 
                          className="group/btn inline-flex items-center space-x-3 text-white/70 hover:text-blue-400 transition-colors duration-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg px-4 py-3"
                          aria-label={`View ${project.title} project details`}
                        >
                          <span className="text-base">View Project</span>
                          <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects */}
          <div className="text-center mt-32">
            <button className="group inline-flex items-center space-x-4 bg-transparent border border-white/20 hover:border-blue-400/50 text-white hover:text-blue-400 px-10 py-5 rounded-full font-medium transition-all duration-500 btn-minimal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <span className="text-lg">View All Projects</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}