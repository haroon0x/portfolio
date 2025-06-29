import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechFlow Inc.',
      content: 'Working with haroon0x was transformative for our product. The attention to detail and user-centric approach resulted in a 40% increase in user engagement.',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'CEO',
      company: 'StartupLab',
      content: 'The minimal design philosophy perfectly aligned with our brand vision. The final product exceeded our expectations in both aesthetics and functionality.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Design Director',
      company: 'Creative Studios',
      content: 'Exceptional work that demonstrates deep understanding of modern design principles. The collaboration was seamless and the results speak for themselves.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
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
    <section id="testimonials" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"
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
      </div>

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h2 className="text-fluid-5xl font-extralight text-white leading-none tracking-tighter mb-8">
              Client
              <span className="block gradient-text font-light mt-4">
                Testimonials
              </span>
            </h2>
            <p className="text-fluid-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance">
              What clients say about working together and the impact of thoughtful design
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="group bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-green-400/30 card-modern"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote size={32} className="text-green-400/30 group-hover:text-green-400/50 transition-colors duration-500" />
                </div>

                {/* Content */}
                <blockquote className="text-white/80 leading-relaxed font-light mb-6 text-balance">
                  "{testimonial.content}"
                </blockquote>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="text-yellow-400 fill-current" 
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-green-400/30 transition-colors duration-500">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}