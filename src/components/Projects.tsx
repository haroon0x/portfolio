import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation();

  const projects = [
    {
      title: 'Containerized Agent',
      description: 'A secure, containerized code execution agent with shell, GUI, and orchestration support. Features isolated environments for safe code execution.',
      tech: ['Python', 'Docker', 'Containerization', 'Security'],
      category: 'AI/ML',
      githubUrl: 'https://github.com/haroon0x/Containerized-agent',
      liveUrl: null
    },
    {
      title: 'CrawlWise - The GEOAgent',
      description: 'An intelligent web crawling agent that discovers marketing opportunities and generates tailored content for SEO optimization.',
      tech: ['TypeScript', 'React', 'AI/ML', 'Web Crawling'],
      category: 'Web Development',
      githubUrl: 'https://github.com/haroon0x/CrawlWise',
      liveUrl: 'https://crawlwise.netlify.app/'
    },
    {
      title: 'PromoAgent',
      description: 'An autonomous agent built with LangGraph that discovers marketing opportunities on Reddit and generates tailored content without getting blocked.',
      tech: ['Python', 'LangGraph', 'AI/ML', 'Marketing'],
      category: 'AI/ML',
      githubUrl: 'https://github.com/haroon0x/PromoAgent',
      liveUrl: 'https://promoagent.onrender.com/'
    },
    {
      title: 'TheAgent - CLI Code Agent',
      description: 'A CLI Code Agent for automated Python code documentation, migration, refactoring, and analysis with intelligent code processing.',
      tech: ['Python', 'CLI', 'Code Analysis', 'Automation'],
      category: 'Development Tools',
      githubUrl: 'https://github.com/haroon0x/TheAgent',
      liveUrl: null
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div 
          ref={ref}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A curated selection of projects that showcase my expertise in creating impactful digital solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.title}
                className={`group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isVisible ? 'animate-fade-in' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                        >
                          <Github size={16} className="text-gray-600 dark:text-gray-300" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
                        >
                          <ExternalLink size={16} className="text-gray-600 dark:text-gray-300" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      {project.category}
                    </span>
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-2">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                      >
                        <span>View Code</span>
                        <Github size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
                      >
                        <span>Live Demo</span>
                    <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects */}
          <div className="text-center mt-12">
            <a 
              href="https://github.com/haroon0x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}