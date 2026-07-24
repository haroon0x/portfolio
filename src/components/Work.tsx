import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  link?: string;
}

interface FeaturedProject extends Project {
  problem: string;
  system: string;
  proof: string[];
}

const featuredProjects: FeaturedProject[] = [
  {
    title: 'Wake AI',
    description: 'Private, searchable AI memory built for Android.',
    problem: 'Useful information is scattered across notifications, screens, apps, and conversations, then becomes difficult to retrieve when only its meaning is remembered.',
    system: 'Wake captures text on device, stores it in Room, combines FTS keyword retrieval with local embeddings, and grounds answers in cited memories using an on-device or user-selected cloud model.',
    proof: ['On-device text and embeddings', 'Hybrid semantic and keyword retrieval', 'Cited answers with approval-gated actions'],
    tags: ['Kotlin', 'Jetpack Compose', 'Gemma'],
    github: 'https://github.com/haroon0x/Wake-ai',
  },
  {
    title: 'DeadDrop',
    description: 'A local-first coding task inbox reachable from anywhere.',
    problem: 'Remote task handoff should not require exposing a developer machine, local repositories, or credentials to a hosted service.',
    system: 'A hosted FastAPI inbox queues work while an authenticated Go worker polls outbound, runs the configured local agent, and returns logs, status, summary, and git diff.',
    proof: ['Outbound-only local worker', 'Token-separated owner and worker access', 'Human-reviewed diff receipts'],
    tags: ['Go', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/haroon0x/DeadDrop',
    link: 'https://deaddrop-dpk8.onrender.com/',
  },
  {
    title: 'OutSync',
    description: 'Reliable database event delivery through the transactional outbox pattern.',
    problem: 'Writing business data and publishing its event separately creates a failure window where state changes can reach the database but never reach the queue.',
    system: 'The application writes business data and an outbox record in one transaction; an asynchronous worker then publishes pending events to Kafka and marks them processed.',
    proof: ['Transactional outbox', 'Asynchronous polling worker', 'Containerized Kafka and PostgreSQL stack'],
    tags: ['FastAPI', 'Kafka', 'PostgreSQL'],
    github: 'https://github.com/haroon0x/OutSync',
  },
];

const archiveProjects: Project[] = [
  {
    title: 'Containerized Agent',
    description: 'Natural-language shell and Python task execution in isolated Docker environments.',
    tags: ['Docker', 'FastAPI', 'Python'],
    github: 'https://github.com/haroon0x/Containerized-agent',
  },
  {
    title: 'CrawlWise',
    description: 'High-performance crawling and structured extraction across thousands of domains.',
    tags: ['TypeScript', 'React', 'AI/ML'],
    github: 'https://github.com/haroon0x/CrawlWise',
    link: 'https://crawlwise.netlify.app/',
  },
  {
    title: 'PromoAgent',
    description: 'Autonomous community outreach with tailored, high-engagement content.',
    tags: ['Python', 'LangGraph', 'Marketing'],
    github: 'https://github.com/haroon0x/PromoAgent',
    link: 'https://promoagent.onrender.com/',
  },
  {
    title: 'Percolation Hypotheses',
    description: 'A hypothesis generation engine built to accelerate computational research.',
    tags: ['Python', 'NLP', 'Research'],
    github: 'https://github.com/haroon0x/percolation-hypotheses-gen',
    link: 'https://percolation-hypotheses.onrender.com/',
  },
  {
    title: 'Neural Network From Scratch',
    description: 'Deep learning fundamentals implemented from first principles.',
    tags: ['Python', 'ML Fundamentals'],
    github: 'https://github.com/haroon0x/NNFromScratch',
  },
];

export default function Work() {
  return (
    <>
      <section id="work" className="safe-x mx-auto max-w-[96rem] scroll-mt-24 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14"
        >
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
          <h2 className="max-w-4xl text-[clamp(2.25rem,4vw,4.75rem)] font-medium leading-none tracking-[-0.045em] text-text-primary">
            Built to work in the real world.
          </h2>
        </motion.div>

        <div className="space-y-16 sm:space-y-24">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCaseStudy key={project.title} project={project} index={index} />
          ))}
        </div>

        <div className="mt-24 sm:mt-32">
          <h3 className="mb-6 text-2xl font-medium tracking-[-0.03em] text-text-primary sm:text-3xl">Everything else</h3>
          <div className="border-t border-border">
            {archiveProjects.map((project, index) => (
              <ProjectRow key={project.title} project={project} index={index + featuredProjects.length} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" aria-label="About" className="safe-x mx-auto max-w-[96rem] scroll-mt-24 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border-y border-border py-14 sm:py-20"
        >
          <div>
            <figure>
              <blockquote cite="https://www.nba.com/watch/video/2017/12/19/20171218-kobe-jersey-retirement-ceremony-kobe-bryant">
                <p className="max-w-5xl text-[clamp(1.7rem,3.2vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.04em] text-text-primary">
                  Those times when you don’t feel like working, you’re too tired, you don’t want to push yourself, but you do it anyway.
                  <span className="mt-5 block text-[clamp(2.35rem,5.4vw,6.5rem)] leading-[0.94] tracking-[-0.055em] text-accent">
                    That is actually the dream. That’s the dream.
                  </span>
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-text-muted">
                <span aria-hidden="true" className="h-px w-10 bg-border-strong" />
                <a
                  href="https://www.nba.com/watch/video/2017/12/19/20171218-kobe-jersey-retirement-ceremony-kobe-bryant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text-primary"
                >
                  Kobe Bryant, 2017
                </a>
              </figcaption>
            </figure>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <a
                href="https://drive.google.com/file/d/1fcm8Z6ul2k97JCTBcJoufh6UHVeSKiOv/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-accent"
              >
                Read résumé
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/pull-requests"
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary transition-colors hover:text-accent"
              >
                Open-source contributions
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function ProjectLinks({ project }: { project: FeaturedProject }) {
  const primaryUrl = project.link ?? project.github;

  return (
    <div className="flex items-center gap-5">
      {project.link && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent">
          View code
        </a>
      )}
      <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:text-accent">
        {project.link ? 'Open project' : 'View repository'}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function ProofList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="font-mono text-[0.7rem] uppercase leading-5 tracking-[0.1em] text-text-secondary">{item}</li>
      ))}
    </ul>
  );
}

const detailLabel = 'font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted';

function FeaturedProjectCaseStudy({ project, index }: { project: FeaturedProject; index: number }) {
  const number = String(index + 1).padStart(2, '0');
  const mirrored = index === 2;

  const article = (children: ReactNode) => (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-border pt-7 sm:pt-9"
    >
      {children}
    </motion.article>
  );

  if (index === 0) {
    return article(
      <>
        <div className="flex items-baseline gap-5 sm:gap-8">
          <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-text-muted">{number}</span>
          <h3 className="text-[clamp(2.6rem,6vw,6rem)] font-medium leading-none tracking-[-0.05em] text-text-primary">{project.title}</h3>
        </div>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="max-w-lg text-xl leading-9 text-text-secondary sm:text-2xl sm:leading-10">{project.description}</p>
            <p className="mt-6 font-mono text-[0.7rem] uppercase leading-5 tracking-[0.16em] text-text-muted">{project.tags.join(', ')}</p>
            <div className="mt-8">
              <ProjectLinks project={project} />
            </div>
          </div>
          <dl className="grid gap-8 sm:grid-cols-2 lg:gap-10">
            <div className="sm:col-span-2">
              <dt className={detailLabel}>Problem</dt>
              <dd className="mt-3 leading-7 text-text-secondary">{project.problem}</dd>
            </div>
            <div>
              <dt className={detailLabel}>System</dt>
              <dd className="mt-3 leading-7 text-text-secondary">{project.system}</dd>
            </div>
            <div>
              <dt className={detailLabel}>Engineering proof</dt>
              <dd>
                <ProofList items={project.proof} />
              </dd>
            </div>
          </dl>
        </div>
      </>,
    );
  }

  const summary = (
    <div className={mirrored ? 'lg:col-start-3' : ''}>
      <h3 className="text-[clamp(2rem,3.4vw,4rem)] font-medium leading-none tracking-[-0.045em] text-text-primary">{project.title}</h3>
      <p className="mt-5 max-w-md text-lg leading-8 text-text-secondary">{project.description}</p>
      <p className="mt-5 font-mono text-[0.7rem] uppercase leading-5 tracking-[0.16em] text-text-muted">{project.tags.join(', ')}</p>
      <div className="mt-8">
        <ProjectLinks project={project} />
      </div>
    </div>
  );

  const detail = (
    <div className={mirrored ? 'lg:col-start-2 lg:row-start-1 lg:border-r lg:border-border lg:pr-8' : 'lg:border-l lg:border-border lg:pl-8'}>
      <dl className="space-y-8">
        <div>
          <dt className={detailLabel}>Problem</dt>
          <dd className="mt-3 max-w-2xl leading-7 text-text-secondary">{project.problem}</dd>
        </div>
        <div>
          <dt className={detailLabel}>System</dt>
          <dd className="mt-3 max-w-2xl leading-7 text-text-secondary">{project.system}</dd>
        </div>
        <div>
          <dt className={detailLabel}>Engineering proof</dt>
          <dd>
            <ProofList items={project.proof} />
          </dd>
        </div>
      </dl>
    </div>
  );

  return article(
    <div className={`grid gap-8 lg:gap-10 ${mirrored ? 'lg:grid-cols-[4rem_minmax(0,1.2fr)_minmax(16rem,0.8fr)]' : 'lg:grid-cols-[4rem_minmax(16rem,0.8fr)_minmax(0,1.2fr)]'}`}>
      <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-text-muted lg:col-start-1 lg:row-start-1">{number}</span>
      {mirrored ? detail : summary}
      {mirrored ? summary : detail}
    </div>,
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.link ?? project.github;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: Math.min((index - featuredProjects.length) * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-b border-border py-8 transition-colors sm:py-10"
    >
      <div className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <div className="grid items-start gap-5 sm:grid-cols-[3rem_minmax(12rem,1fr)_minmax(16rem,1.15fr)_auto] sm:gap-8">
        <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-text-muted">{String(index + 1).padStart(2, '0')}</span>
        <h4 className="text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl">{project.title}</h4>
        <div>
          <p className="max-w-lg leading-7 text-text-secondary">{project.description}</p>
          <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-text-muted">{project.tags.join(', ')}</p>
        </div>
        <div className="flex items-center gap-4 sm:justify-end">
          {project.link && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-text-primary">
              Code
            </a>
          )}
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-primary transition-[border-color,color,transform] duration-300 hover:border-accent hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
