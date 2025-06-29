import React from 'react';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation';

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();
  const { ref: staggerRef, getItemDelay } = useStaggerAnimation(12, 0.1);

  const allProjects = [
    {
      id: 1,
      title: 'Minimal Banking',
      category: 'Fintech',
      description: 'Clean, intuitive banking interface focused on user experience and accessibility. Designed to simplify complex financial data into digestible, actionable insights.',
      longDescription: 'A comprehensive banking platform that reimagines how users interact with their financial data. Built with React and TypeScript, featuring real-time transaction monitoring, advanced analytics, and seamless mobile experience.',
      year: '2024',
      duration: '6 months',
      tech: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Node.js', 'PostgreSQL'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 2,
      title: 'Studio Portfolio',
      category: 'Creative',
      description: 'Elegant portfolio showcasing architectural photography with minimal design principles. Every element carefully crafted to highlight the beauty of space and form.',
      longDescription: 'A stunning portfolio website for an architectural photography studio. Features custom image galleries, smooth animations, and a content management system for easy updates.',
      year: '2024',
      duration: '4 months',
      tech: ['Next.js', 'Framer Motion', 'GSAP', 'Sanity', 'Vercel'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 3,
      title: 'Health Dashboard',
      category: 'Healthcare',
      description: 'Comprehensive health monitoring platform with clean data visualization. Transforming complex medical data into clear, understandable visual narratives.',
      longDescription: 'A healthcare analytics platform that helps medical professionals track patient data and health trends. Features interactive charts, real-time monitoring, and secure data handling.',
      year: '2023',
      duration: '8 months',
      tech: ['Vue.js', 'D3.js', 'Node.js', 'MongoDB', 'Socket.io'],
      status: 'Development',
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 4,
      title: 'E-Commerce Minimal',
      category: 'Retail',
      description: 'Streamlined shopping experience with focus on product presentation and usability. Reducing friction in the customer journey while maintaining visual elegance.',
      longDescription: 'A modern e-commerce platform built for a luxury fashion brand. Features advanced filtering, wishlist functionality, and seamless checkout experience.',
      year: '2023',
      duration: '5 months',
      tech: ['React', 'Shopify', 'Stripe', 'GraphQL', 'Tailwind'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 5,
      title: 'Task Management Pro',
      category: 'Productivity',
      description: 'Intuitive task management application with team collaboration features. Built for modern teams who value simplicity and efficiency.',
      longDescription: 'A comprehensive project management tool designed for creative teams. Features kanban boards, time tracking, team chat, and advanced reporting capabilities.',
      year: '2023',
      duration: '7 months',
      tech: ['React', 'Redux', 'Express', 'MongoDB', 'Socket.io'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 6,
      title: 'Weather Insights',
      category: 'Utility',
      description: 'Beautiful weather application with detailed forecasts and climate data visualization. Designed for weather enthusiasts and professionals.',
      longDescription: 'A sophisticated weather application that provides detailed meteorological data with beautiful visualizations. Features location-based forecasts, weather maps, and historical data analysis.',
      year: '2023',
      duration: '3 months',
      tech: ['React', 'Chart.js', 'OpenWeather API', 'PWA'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 7,
      title: 'Recipe Curator',
      category: 'Lifestyle',
      description: 'Elegant recipe discovery platform with personalized recommendations. Connecting food lovers with curated culinary experiences.',
      longDescription: 'A recipe platform that uses machine learning to provide personalized recipe recommendations. Features meal planning, shopping lists, and social sharing capabilities.',
      year: '2022',
      duration: '4 months',
      tech: ['React', 'Python', 'Django', 'PostgreSQL', 'ML'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
      links: {
        live: '#',
        github: '#'
      }
    },
    {
      id: 8,
      title: 'Fitness Tracker',
      category: 'Health',
      description: 'Comprehensive fitness tracking application with workout planning and progress monitoring. Built for fitness enthusiasts and personal trainers.',
      longDescription: 'A complete fitness ecosystem that helps users track workouts, plan routines, and monitor progress. Features social challenges, trainer connections, and detailed analytics.',
      year: '2022',
      duration: '6 months',
      tech: ['React Native', 'Firebase', 'Redux', 'HealthKit'],
      status: 'Live',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
      links: {
        live: '#',
        github: '#'
      }
    }
  ];

  const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))];
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedProject, setSelectedProject] = React.useState<typeof allProjects[0] | null>(null);

  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory);

  const featuredProjects = allProjects.filter(p => p.featured);

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
        <div className="absolute inset-0 perspective-1000">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float-3d transform-gpu" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-float-3d transform-gpu" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center space-y-8 transform-3d">
            <h1 className="text-6xl md:text-8xl font-extralight leading-none tracking-tighter">
              <span className="block text-white mb-4">All</span>
              <span className="block gradient-text font-light">Projects</span>
            </h1>
            <p className="text-xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
              A comprehensive showcase of digital experiences crafted with precision, purpose, and minimal aesthetic principles
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-4">Featured Work</h2>
            <p className="text-white/60 font-light">Highlighted projects that showcase key capabilities and achievements</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="group relative bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-400/30 card-3d cursor-pointer"
                onClick={() => setSelectedProject(project)}
                data-cursor="project"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Live' 
                        ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                        : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    }`}>
                      {project.status}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full border border-white/20">
                        {project.category}
                      </span>
                      <span className="text-white/60 text-sm font-medium">{project.year}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-light text-white group-hover:gradient-text transition-all duration-500">
                    {project.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed font-light text-sm">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-zinc-900/50 text-white/60 text-xs font-medium rounded border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-1 bg-zinc-900/50 text-white/60 text-xs font-medium rounded border border-white/10">
                        +{project.tech.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-zinc-950 rounded-2xl border border-white/20">
            <div className="relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white/70 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-light gradient-text">{selectedProject.title}</h2>
                  <div className="flex items-center space-x-4">
                    <a 
                      href={selectedProject.links.live}
                      className="p-2 bg-zinc-900 border border-white/10 hover:border-blue-400/30 rounded-lg transition-all duration-300 hover-lift"
                    >
                      <ExternalLink size={16} className="text-white/70 hover:text-blue-400" />
                    </a>
                    <a 
                      href={selectedProject.links.github}
                      className="p-2 bg-zinc-900 border border-white/10 hover:border-blue-400/30 rounded-lg transition-all duration-300 hover-lift"
                    >
                      <Github size={16} className="text-white/70 hover:text-blue-400" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <Tag size={14} />
                    <span>{selectedProject.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>{selectedProject.year} • {selectedProject.duration}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${
                    selectedProject.status === 'Live' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      selectedProject.status === 'Live' ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    <span>{selectedProject.status}</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-white/80 leading-relaxed font-light">
                {selectedProject.longDescription}
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-light text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="px-4 py-2 bg-zinc-900 text-white/80 rounded-lg border border-white/10 hover:border-blue-400/30 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <a 
                  href={selectedProject.links.live}
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover-lift"
                >
                  <span>View Live</span>
                  <ArrowUpRight size={16} />
                </a>
                <a 
                  href={selectedProject.links.github}
                  className="inline-flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium border border-white/10 hover:border-white/20 transition-all duration-300 hover-lift"
                >
                  <span>View Code</span>
                  <Github size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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