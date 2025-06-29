import React from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Blog() {
  const { ref, isVisible } = useScrollAnimation();

  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Digital Minimalism',
      excerpt: 'Exploring how less can be more in modern web design. Understanding the principles that drive clean, purposeful digital experiences.',
      content: 'In a world saturated with digital noise, minimalism emerges as a beacon of clarity...',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Design',
      tags: ['Minimalism', 'UX', 'Design Philosophy'],
      featured: true,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Building Performant React Applications',
      excerpt: 'Best practices for creating fast, scalable React applications that deliver exceptional user experiences.',
      content: 'Performance is not just about speed—it\'s about creating seamless user experiences...',
      date: '2024-01-08',
      readTime: '8 min read',
      category: 'Development',
      tags: ['React', 'Performance', 'JavaScript'],
      featured: true,
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'The Future of Web Animations',
      excerpt: 'How modern animation libraries are reshaping user interactions and creating more engaging digital experiences.',
      content: 'Animation in web design has evolved from simple transitions to complex, meaningful interactions...',
      date: '2024-01-01',
      readTime: '6 min read',
      category: 'Frontend',
      tags: ['Animation', 'Framer Motion', 'CSS'],
      featured: false,
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      title: 'Accessibility in Modern Design',
      excerpt: 'Creating inclusive digital experiences that work for everyone, regardless of their abilities or circumstances.',
      content: 'Accessibility is not an afterthought—it\'s a fundamental aspect of good design...',
      date: '2023-12-25',
      readTime: '7 min read',
      category: 'UX',
      tags: ['Accessibility', 'Inclusive Design', 'WCAG'],
      featured: false,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

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
    <section id="blog" className="py-32 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-full blur-3xl"
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
              Thoughts &
              <span className="block gradient-text font-light mt-4">
                Insights
              </span>
            </h2>
            <p className="text-fluid-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed text-balance">
              Exploring the intersection of design, technology, and human experience through thoughtful writing
            </p>
          </motion.div>

          {/* Featured Posts */}
          <motion.div 
            className="mb-20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-light text-white mb-8 flex items-center">
              <span className="w-8 h-px bg-gradient-to-r from-purple-400 to-pink-400 mr-4"></span>
              Featured Articles
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  className="group bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 card-modern cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-400/30">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-white/50">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-light text-white group-hover:gradient-text transition-all duration-500 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/70 leading-relaxed font-light text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-zinc-900/50 text-white/60 text-xs font-medium rounded border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button className="flex items-center space-x-2 text-purple-400 hover:text-pink-400 font-medium group-hover:translate-x-2 transition-all duration-300">
                        <span className="text-sm">Read More</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Recent Posts */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-light text-white mb-8 flex items-center">
              <span className="w-8 h-px bg-gradient-to-r from-blue-400 to-cyan-400 mr-4"></span>
              Recent Posts
            </h3>
            
            <div className="space-y-6">
              {recentPosts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  className="group flex flex-col md:flex-row gap-6 p-6 bg-zinc-950/50 rounded-xl border border-white/5 hover:border-white/10 hover:bg-zinc-950/80 transition-all duration-500"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  <div className="md:w-48 aspect-video md:aspect-square relative overflow-hidden rounded-lg flex-shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-white/50">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded border border-blue-400/30">
                        {post.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-light text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/60 leading-relaxed font-light text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-zinc-900/30 text-white/50 text-xs font-medium rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button className="flex items-center space-x-1 text-blue-400 hover:text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span>Read</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* View All Posts */}
          <motion.div 
            className="text-center mt-16"
            variants={itemVariants}
          >
            <Link to="/blog">
              <motion.button
                className="group inline-flex items-center space-x-4 bg-transparent border border-white/20 hover:border-purple-400/50 text-white hover:text-purple-400 px-10 py-5 rounded-full font-medium btn-modern focus-ring"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">View All Posts</span>
                <motion.div
                  whileHover={{ x: 4, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}