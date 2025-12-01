import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface WorkProps {
  order?: 'latest' | 'all';
}

export default function Work({ order = 'all' }: WorkProps) {
  const projects = [
    {
      title: 'Containerized Agent',
      description: 'A secure, containerized code execution agent that increased code execution reliability by 99.8% and reduced security incidents by 75% through isolated environments.',
      tags: ['Python', 'Docker', 'Security'],
      github: 'https://github.com/haroon0x/Containerized-agent',
      size: 'large' as const
    },
    {
      title: 'CrawlWise - The GEOAgent',
      description: 'An intelligent web crawling agent that discovered over 10,000 new marketing opportunities and boosted SEO content generation by 300%.',
      tags: ['TypeScript', 'React', 'AI/ML'],
      github: 'https://github.com/haroon0x/CrawlWise',
      link: 'https://crawlwise.netlify.app/',
      size: 'medium' as const
    },
    {
      title: 'PromoAgent',
      description: 'An autonomous agent that increased marketing outreach by 500% on Reddit by generating tailored, high-engagement content.',
      tags: ['Python', 'LangGraph', 'Marketing'],
      github: 'https://github.com/haroon0x/PromoAgent',
      link: 'https://promoagent.onrender.com/',
      size: 'small' as const
    },
    {
      title: 'TheAgent - CLI Code Agent',
      description: 'A CLI Code Agent that automated Python code documentation, migration, and refactoring, resulting in a 40% reduction in manual coding time.',
      tags: ['Python', 'CLI', 'Automation'],
      github: 'https://github.com/haroon0x/TheAgent',
      size: 'small' as const
    },
    {
      title: 'Percolation Hypotheses Generator',
      description: 'A hypothesis generation engine that accelerated research by 60% by automating the exploration of hypothesis complexity.',
      tags: ['Python', 'NLP', 'Research'],
      github: 'https://github.com/haroon0x/percolation-hypotheses-gen',
      link: 'https://percolation-hypotheses.onrender.com/',
      size: 'wide' as const
    },
    {
      title: 'Neural Network From Scratch',
      description: 'An educational project that achieved a 95% accuracy rate on foundational ML problems by implementing neural networks from scratch.',
      tags: ['Python', 'Java', 'ML Fundamentals'],
      github: 'https://github.com/haroon0x/NNFromScratch',
      size: 'small' as const
    }
  ];

  const displayProjects = order === 'latest' ? projects.slice(0, 3) : projects;

  return (
    <section id="work" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
          Selected <span className="text-accent">Works</span>
        </h2>
        <p className="text-xl text-white/60 max-w-2xl font-light">
          A collection of projects exploring AI, autonomous agents, and interactive web experiences.
        </p>
      </motion.div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {displayProjects.map((project, index) => (
          <SpotlightCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function SpotlightCard({ project, index }: { project: any; index: number }) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md hover:border-white/20 transition-colors duration-500"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl font-light">
              {project.description}
            </p>

            <div className="flex gap-3 flex-wrap">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 text-sm font-mono rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center self-end md:self-center">
            {(project.link || project.github) && (
              <a
                href={project.link || project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
              >
                <span>View Project</span>
                <ArrowRight size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}