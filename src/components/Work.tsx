import React from 'react';
import { motion } from 'framer-motion';
import BentoGrid from './BentoGrid';

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
      size: 'medium' as const
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
      size: 'medium' as const
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

      <BentoGrid projects={displayProjects} />
    </section>
  );
}