import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  link?: string;
}

export default function Work() {
  const projects: Project[] = [
    {
      title: 'Containerized Agent',
      description: 'A secure, containerized code execution agent that runs untrusted AI-generated code in isolated sandbox environments to protect host systems from malicious processes.',
      tags: ['Docker', 'FastAPI', 'Security'],
      github: 'https://github.com/haroon0x/Containerized-agent',
    },
    {
      title: 'DeadDrop - Asynchronous Task Agent',
      description: 'A sovereign, asynchronous coding task inbox and local agent runner powered by a FastAPI dashboard and a high-performance Go worker polling outbound via secure tokens.',
      tags: ['Go', 'FastAPI', 'Supabase', 'Agent Orchestration'],
      github: 'https://github.com/haroon0x/DeadDrop',
    },
    {
      title: 'OutSync - Distributed Event System',
      description: 'An asynchronous backend system that implements the transactional outbox pattern to safely forward PostgreSQL database events to Redis queues for event-driven webhooks and automation pipelines.',
      tags: ['Python', 'Redis', 'PostgreSQL', 'Asyncio'],
      github: 'https://github.com/haroon0x/OutSync',
    },
    {
      title: 'CrawlWise - The GEOAgent',
      description: 'An intelligent web crawling agent designed for high-performance asynchronous web crawling and large-scale, structured data extraction across thousands of domains.',
      tags: ['TypeScript', 'React', 'AI/ML'],
      github: 'https://github.com/haroon0x/CrawlWise',
      link: 'https://crawlwise.netlify.app/',
    },
    {
      title: 'PromoAgent',
      description: 'An autonomous agent that automates marketing outreach on community platforms by generating tailored, high-engagement content.',
      tags: ['Python', 'LangGraph', 'Marketing'],
      github: 'https://github.com/haroon0x/PromoAgent',
      link: 'https://promoagent.onrender.com/',
    },
    {
      title: 'Percolation Hypotheses Generator',
      description: 'A hypothesis generation engine that automates the exploration of hypothesis complexity to accelerate computational research.',
      tags: ['Python', 'NLP', 'Research'],
      github: 'https://github.com/haroon0x/percolation-hypotheses-gen',
      link: 'https://percolation-hypotheses.onrender.com/',
    },
    {
      title: 'Neural Network From Scratch',
      description: 'An educational project implementing deep learning and neural network structures from scratch to achieve high classification accuracy.',
      tags: ['Python', 'ML Fundamentals'],
      github: 'https://github.com/haroon0x/NNFromScratch',
    }
  ];

  return (
    <section id="work" className="safe-x fluid-section relative z-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-10 sm:mb-16"
      >
        <h2 className="mb-4 font-heading text-title text-ink text-balance sm:mb-6">
          Selected <span className="text-accent">Works</span>
        </h2>
        <p className="max-w-2xl text-body-lg text-ink-secondary text-pretty">
          A collection of projects exploring AI, autonomous agents, and interactive web experiences.
        </p>
      </motion.div>

      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:gap-8">
        {projects.map((project, index) => (
          <SpotlightCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function SpotlightCard({ project, index }: { project: Project; index: number }) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
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
      className="card-container group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-petal transition-colors duration-500 hover:shadow-petal-lg hover:border-accent/30"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(62,122,82,0.07), transparent 40%)`,
        }}
      />

      <div className="cq-card-pad relative p-5 sm:p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-start justify-between gap-3 sm:items-center">
              <h3 className="cq-card-title min-w-0 font-heading text-heading text-ink transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <div className="flex shrink-0 gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} on GitHub`}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-ink/[0.03] p-2 text-ink-muted transition-colors hover:text-ink hover:border-ink/20"
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open live link for ${project.title}`}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-ink/[0.03] p-2 text-ink-muted transition-colors hover:text-ink hover:border-ink/20"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <p className="mb-6 max-w-2xl text-sm leading-7 text-ink-secondary sm:mb-8 sm:text-base sm:leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {project.tags.map((tag: string) => (
                <span key={tag} className="rounded-full border border-border bg-ink/[0.04] px-3 py-1.5 font-mono text-xs text-ink-secondary transition-colors hover:text-ink sm:px-4 sm:text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center self-start md:self-center">
            {(project.link || project.github) && (
                <a
                  href={project.link || project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View project details for ${project.title}`}
                  className="flex min-h-11 items-center gap-2 rounded-lg py-1 text-sm font-medium text-accent opacity-100 transition-[opacity,transform] duration-300 sm:text-base md:translate-x-[-10px] md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
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
