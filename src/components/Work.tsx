import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Work() {
  const { ref, isVisible } = useScrollAnimation();

  const projects = [
    {
      title: 'Minimal Banking',
      category: 'Fintech',
      description: 'Clean, intuitive banking interface focused on user experience and accessibility.',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2024'
    },
    {
      title: 'Studio Portfolio',
      category: 'Creative',
      description: 'Elegant portfolio showcasing architectural photography with minimal design principles.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2024'
    },
    {
      title: 'Health Dashboard',
      category: 'Healthcare',
      description: 'Comprehensive health monitoring platform with clean data visualization.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2023'
    },
    {
      title: 'E-Commerce Minimal',
      category: 'Retail',
      description: 'Streamlined shopping experience with focus on product presentation and usability.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      year: '2023'
    }
  ];

  return (
    <section id="work" className="py-32 bg-zinc-950 relative">
      <div className="max-w-6xl mx-auto px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Header */}
          <div className="mb-20">
            <h2 className="text-6xl md:text-7xl font-extralight text-white leading-none tracking-tighter mb-6">
              Selected
              <span className="block gradient-text font-light mt-2">
                Work
              </span>
            </h2>
            <p className="text-xl text-white/70 font-light max-w-2xl">
              A collection of projects that embody clean design and purposeful functionality
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-16">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className={`group grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
                } ${isVisible ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Image */}
                <div className={`relative ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <div className="aspect-[4/3] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 card-minimal">
                    <img 
                      src={project.image} 
                      alt={`${project.title} project screenshot`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Project Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-white/50 font-medium">
                      <span>{project.category}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-light text-white tracking-tight group-hover:gradient-text transition-all duration-500">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-white/70 leading-relaxed font-light">
                    {project.description}
                  </p>

                  <button 
                    className="group/btn inline-flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg px-3 py-2"
                    aria-label={`View ${project.title} project`}
                  >
                    <span>View Project</span>
                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}