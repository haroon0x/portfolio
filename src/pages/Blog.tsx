import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Blog() {
  const { ref, isVisible } = useScrollAnimation();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Digital Minimalism',
      excerpt: 'Exploring how less can be more in modern web design. Understanding the principles that drive clean, purposeful digital experiences.',
      content: 'In a world saturated with digital noise, minimalism emerges as a beacon of clarity. This philosophy extends beyond mere aesthetics—it\'s about intentional design decisions that prioritize user experience and meaningful interactions.',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Design',
      tags: ['Minimalism', 'UX', 'Design Philosophy', 'User Experience'],
      featured: true,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Building Performant React Applications',
      excerpt: 'Best practices for creating fast, scalable React applications that deliver exceptional user experiences.',
      content: 'Performance is not just about speed—it\'s about creating seamless user experiences that feel natural and responsive. In this comprehensive guide, we explore advanced optimization techniques.',
      date: '2024-01-08',
      readTime: '8 min read',
      category: 'Development',
      tags: ['React', 'Performance', 'JavaScript', 'Optimization'],
      featured: true,
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'The Future of Web Animations',
      excerpt: 'How modern animation libraries are reshaping user interactions and creating more engaging digital experiences.',
      content: 'Animation in web design has evolved from simple transitions to complex, meaningful interactions that guide users and provide feedback.',
      date: '2024-01-01',
      readTime: '6 min read',
      category: 'Frontend',
      tags: ['Animation', 'Framer Motion', 'CSS', 'Interactions'],
      featured: false,
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      title: 'Accessibility in Modern Design',
      excerpt: 'Creating inclusive digital experiences that work for everyone, regardless of their abilities or circumstances.',
      content: 'Accessibility is not an afterthought—it\'s a fundamental aspect of good design that benefits all users.',
      date: '2023-12-25',
      readTime: '7 min read',
      category: 'UX',
      tags: ['Accessibility', 'Inclusive Design', 'WCAG', 'Standards'],
      featured: false,
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      title: 'TypeScript Best Practices',
      excerpt: 'Advanced TypeScript patterns and practices for building robust, maintainable applications.',
      content: 'TypeScript has revolutionized JavaScript development by adding static typing and advanced tooling support.',
      date: '2023-12-18',
      readTime: '9 min read',
      category: 'Development',
      tags: ['TypeScript', 'JavaScript', 'Best Practices', 'Types'],
      featured: false,
      image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 6,
      title: 'Design Systems at Scale',
      excerpt: 'Building and maintaining design systems that grow with your organization and product needs.',
      content: 'A well-crafted design system is the foundation of consistent, scalable digital products.',
      date: '2023-12-10',
      readTime: '10 min read',
      category: 'Design',
      tags: ['Design Systems', 'Scalability', 'Components', 'Consistency'],
      featured: false,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <nav className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="inline-flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-3 py-2"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="text-xl font-bold">
              <span className="gradient-text">haroon0x</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-extralight leading-none tracking-tighter">
              <span className="block text-white mb-4">Blog &</span>
              <span className="block gradient-text font-light">Insights</span>
            </h1>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
              Thoughts on design, development, and the evolving landscape of digital experiences
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-400/50 focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-white/40 mr-2" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-900 text-white/70 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 card-modern cursor-pointer"
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

                  {post.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded border border-yellow-400/30">
                        Featured
                      </span>
                    </div>
                  )}
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
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-light text-white tracking-tight">
                Let's work together
              </h3>
              <a 
                href="mailto:hello@haroon0x.com"
                className="inline-flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300 font-medium"
              >
                <span>hello@haroon0x.com</span>
              </a>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <div className="text-xl font-light mb-2">
                  <span className="gradient-text">haroon0x</span>
                </div>
                <p className="text-white/50 text-sm font-light">
                  © 2024 All rights reserved
                </p>
              </div>

              <Link
                to="/"
                className="group p-3 bg-zinc-900 border border-white/10 hover:border-blue-400/30 rounded-xl transition-all duration-300 hover-lift"
              >
                <ArrowLeft size={16} className="text-white/70 group-hover:text-blue-400 group-hover:-translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}