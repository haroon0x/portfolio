import React from 'react';
import { Code, Palette, Smartphone, Globe } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Services() {
  const { ref, isVisible } = useScrollAnimation();

  const services = [
    {
      icon: Code,
      title: 'Development',
      description: 'Clean, efficient code that brings designs to life with precision and performance.',
    },
    {
      icon: Palette,
      title: 'Design',
      description: 'Minimal, purposeful design that prioritizes user experience and visual clarity.',
    },
    {
      icon: Smartphone,
      title: 'Mobile',
      description: 'Responsive solutions that work seamlessly across all devices and platforms.',
    },
    {
      icon: Globe,
      title: 'Strategy',
      description: 'Thoughtful planning and consultation to align design with business objectives.',
    }
  ];

  return (
    <section id="services" className="py-32 bg-black relative">
      <div className="max-w-5xl mx-auto px-8">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-extralight text-white leading-none tracking-tighter mb-6">
              What I
              <span className="block gradient-text font-light mt-2">
                Offer
              </span>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className={`group space-y-6 p-8 bg-zinc-950 rounded-2xl border border-white/10 hover:border-blue-400/30 card-minimal ${
                  isVisible ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <service.icon size={24} className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-white group-hover:gradient-text transition-all duration-500">
                    {service.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}