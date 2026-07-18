import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  console: string[];
}

interface ArchiveProject extends Project {
  problem: string;
  system: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const typeCharacterDelay = 18;
const typeLineDelay = 120;

const featuredProjects: FeaturedProject[] = [
  {
    title: 'Wake AI',
    description: 'Private, searchable AI memory built for Android.',
    problem: 'Useful information is scattered across notifications, screens, apps, and conversations, then becomes difficult to retrieve when only its meaning is remembered.',
    system: 'Wake captures text on device, stores it in Room, combines FTS keyword retrieval with local embeddings, and grounds answers in cited memories using an on-device or user-selected cloud model.',
    proof: ['On-device text and embeddings', 'Hybrid semantic and keyword retrieval', 'Cited answers with approval-gated actions'],
    console: ['wake > indexed 12,403 memories', 'fts + embedding hybrid: 41ms p95', 'citation grounded: 3 sources'],
    tags: ['Kotlin', 'Jetpack Compose', 'Gemma'],
    github: 'https://github.com/haroon0x/Wake-ai',
  },
  {
    title: 'DeadDrop',
    description: 'A local-first coding task inbox reachable from anywhere.',
    problem: 'Remote task handoff should not require exposing a developer machine, local repositories, or credentials to a hosted service.',
    system: 'A hosted FastAPI inbox queues work while an authenticated Go worker polls outbound, runs the configured local agent, and returns logs, status, summary, and git diff.',
    proof: ['Outbound-only local worker', 'Token-separated owner and worker access', 'Human-reviewed diff receipts'],
    console: ['worker poll: 15s interval', 'diff receipt: +412 −87 across 9 files', 'worker auth: token scope verified'],
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
    console: ['tx commit: order + outbox row', 'worker: published 1,204/1,204', 'lag p99: 280ms'],
    tags: ['FastAPI', 'Kafka', 'PostgreSQL'],
    github: 'https://github.com/haroon0x/OutSync',
  },
];

const archiveProjects: ArchiveProject[] = [
  {
    title: 'Containerized Agent',
    description: 'Natural-language shell and Python task execution in isolated Docker environments.',
    problem: 'Agent-generated commands need strong isolation before they can run safely.',
    system: 'Tasks execute inside disposable Docker environments behind a FastAPI control plane.',
    tags: ['Docker', 'FastAPI', 'Python'],
    github: 'https://github.com/haroon0x/Containerized-agent',
  },
  {
    title: 'CrawlWise',
    description: 'High-performance crawling and structured extraction across thousands of domains.',
    problem: 'Large web research jobs become brittle when crawling and extraction are handled separately.',
    system: 'A TypeScript pipeline crawls domains and turns page content into structured research data.',
    tags: ['TypeScript', 'React', 'AI/ML'],
    github: 'https://github.com/haroon0x/CrawlWise',
    link: 'https://crawlwise.netlify.app/',
  },
  {
    title: 'PromoAgent',
    description: 'Autonomous community outreach with tailored, high-engagement content.',
    problem: 'Generic promotion fails when every community expects context-specific communication.',
    system: 'A LangGraph workflow researches communities and produces tailored outreach for review.',
    tags: ['Python', 'LangGraph', 'Marketing'],
    github: 'https://github.com/haroon0x/PromoAgent',
    link: 'https://promoagent.onrender.com/',
  },
  {
    title: 'Percolation Hypotheses',
    description: 'A hypothesis generation engine built to accelerate computational research.',
    problem: 'Researchers spend substantial time turning fragmented literature into testable directions.',
    system: 'An NLP pipeline synthesizes source material into structured, inspectable hypotheses.',
    tags: ['Python', 'NLP', 'Research'],
    github: 'https://github.com/haroon0x/percolation-hypotheses-gen',
    link: 'https://percolation-hypotheses.onrender.com/',
  },
  {
    title: 'Neural Network From Scratch',
    description: 'Deep learning fundamentals implemented from first principles.',
    problem: 'High-level frameworks can hide the mechanics that make neural networks learn.',
    system: 'Core layers, training, and backpropagation are implemented directly in Python.',
    tags: ['Python', 'ML Fundamentals'],
    github: 'https://github.com/haroon0x/NNFromScratch',
  },
];

const operatingLedger = [
  { year: '2026', focus: 'Wake AI', detail: 'On-device memory for Android' },
  { year: '2025', focus: 'Systems', detail: 'Local-first agents and reliable event delivery' },
  { year: '2024', focus: 'Applied AI', detail: 'Retrieval, crawling, and research tooling' },
  { year: '2023', focus: 'Foundations', detail: 'Neural networks and backend systems' },
];

const workingPrinciples = [
  { name: 'Ship the boring version first', detail: 'Make the core path reliable before making it clever.' },
  { name: 'Proof over claims', detail: 'Prefer working artifacts, measurements, and visible receipts.' },
  { name: 'Local-first by default', detail: 'Keep data and capability close to the person using them.' },
];

export default function Work() {
  const [openArchiveProject, setOpenArchiveProject] = useState<string | null>(null);

  return (
    <>
      <section id="work" className="safe-x mx-auto max-w-[96rem] scroll-mt-24 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex items-end justify-between gap-8 sm:mb-14"
        >
          <div>
            <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
            <h2 className="text-[clamp(2.25rem,4vw,4.75rem)] font-medium leading-none tracking-[-0.045em] text-text-primary">
              Built to work in the real world.
            </h2>
          </div>
          <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.18em] text-text-muted sm:block">2023—2026</span>
        </motion.div>

        <div className="space-y-16 sm:space-y-24">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCaseStudy key={project.title} project={project} index={index} />
          ))}
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="mb-6 flex items-center justify-between gap-6">
            <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">Project archive</h3>
            <span className="font-mono text-[0.64rem] tabular-nums tracking-[0.14em] text-text-muted">04—08</span>
          </div>
          <div className="border-t border-border">
            {archiveProjects.map((project, index) => (
              <ProjectRow
                key={project.title}
                project={project}
                index={index + featuredProjects.length}
                expanded={openArchiveProject === project.title}
                onToggle={() => setOpenArchiveProject((current) => current === project.title ? null : project.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="safe-x mx-auto max-w-[96rem] scroll-mt-24 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 border-y border-border py-14 sm:py-20 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">About</p>
          <div className="space-y-14 sm:space-y-16">
            <div>
              <p className="max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
                I&apos;m Muhammed Haroon, an independent engineer based in India. I build AI systems, developer tools, and reliable infrastructure from first principles through production. My work favors local control, inspectable behavior, and evidence that the system does what it claims.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Operating ledger</h3>
              <ol className="mt-5 border-t border-border">
                {operatingLedger.map((entry) => (
                  <li key={entry.year} className="grid gap-2 border-b border-border py-4 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.12em] sm:grid-cols-[4rem_8rem_minmax(0,1fr)] sm:gap-6">
                    <span className="tabular-nums text-accent">{entry.year}</span>
                    <span className="text-text-primary">{entry.focus}</span>
                    <span className="text-text-secondary">{entry.detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">How I work</h3>
              <dl className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
                {workingPrinciples.map((principle) => (
                  <div key={principle.name} className="bg-background p-5 sm:p-6">
                    <dt className="font-mono text-[0.64rem] uppercase leading-5 tracking-[0.14em] text-text-primary">{principle.name}</dt>
                    <dd className="mt-3 text-sm leading-6 text-text-secondary">{principle.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="border-t border-border pt-12">
              <blockquote cite="https://www.nba.com/watch/video/2017/12/19/20171218-kobe-jersey-retirement-ceremony-kobe-bryant">
                <p className="max-w-5xl text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.035em] text-text-primary">
                  Those times when you don’t feel like working, you’re too tired, you don’t want to push yourself, but you do it anyway.
                  <span className="mt-5 block text-[clamp(2rem,4vw,4.75rem)] leading-[0.98] tracking-[-0.05em] text-accent">
                    That is actually the dream. That’s the dream.
                  </span>
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-text-muted">
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
            <div className="flex flex-wrap gap-x-8 gap-y-4">
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

function FeaturedProjectCaseStudy({ project, index }: { project: FeaturedProject; index: number }) {
  const primaryUrl = project.link ?? project.github;
  const [motifTrigger, setMotifTrigger] = useState(0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: EASE }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setMotifTrigger((current) => current + 1);
      }}
      className="border-t border-border pt-7 sm:pt-9"
    >
      <div className="grid gap-8 lg:grid-cols-[4rem_minmax(16rem,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
        <div className="flex items-start gap-5 lg:block">
          <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-text-muted">{String(index + 1).padStart(2, '0')}</span>
          <AsciiMotif title={project.title} trigger={motifTrigger} />
        </div>
        <div>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-accent">Featured system</p>
          <h3 className="mt-3 text-[clamp(2rem,3.4vw,4rem)] font-medium leading-none tracking-[-0.045em] text-text-primary">{project.title}</h3>
          <p className="mt-5 max-w-md text-lg leading-8 text-text-secondary">{project.description}</p>
          <p className="mt-5 font-mono text-[0.64rem] uppercase leading-5 tracking-[0.16em] text-text-muted">{project.tags.join(', ')}</p>
          <div className="mt-8 flex items-center gap-5">
            {project.link && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent">
                View code
              </a>
            )}
            <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:text-accent">
              {project.link ? 'Open project' : 'View repository'}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <div className="border-l border-border pl-6 sm:pl-8">
          <dl className="space-y-8">
            <div>
              <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Problem</dt>
              <dd className="mt-3 max-w-2xl leading-7 text-text-secondary">{project.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">System</dt>
              <dd className="mt-3 max-w-2xl leading-7 text-text-secondary">{project.system}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Engineering proof</dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {project.proof.map((item) => (
                  <span key={item} className="border border-border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-text-secondary">{item}</span>
                ))}
              </dd>
            </div>
          </dl>
          <ConsolePanel title={project.title} lines={project.console} />
        </div>
      </div>
    </motion.article>
  );
}

function ConsolePanel({ title, lines }: { title: string; lines: string[] }) {
  const figureRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const [renderedLines, setRenderedLines] = useState(() => lines.map(() => ''));
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      startedRef.current = true;
      setRenderedLines(lines);
      setComplete(true);
      return;
    }

    const figure = figureRef.current;
    if (!figure) return;
    let timeout: number | undefined;
    let cancelled = false;

    const typeLine = (lineIndex: number, characterIndex: number) => {
      if (cancelled) return;
      if (lineIndex >= lines.length) {
        setComplete(true);
        return;
      }

      if (characterIndex < lines[lineIndex].length) {
        setRenderedLines((current) => current.map((line, index) => index === lineIndex ? lines[lineIndex].slice(0, characterIndex + 1) : line));
        timeout = window.setTimeout(() => typeLine(lineIndex, characterIndex + 1), typeCharacterDelay);
        return;
      }

      timeout = window.setTimeout(() => typeLine(lineIndex + 1, 0), typeLineDelay);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || startedRef.current) return;
      startedRef.current = true;
      observer.disconnect();
      typeLine(0, 0);
    }, { threshold: 0.35 });

    observer.observe(figure);
    return () => {
      cancelled = true;
      observer.disconnect();
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [lines, shouldReduceMotion]);

  return (
    <figure ref={figureRef} className="mt-8 border border-border">
      <figcaption className="sr-only">{`${title} test output: ${lines.join('; ')}`}</figcaption>
      <div aria-hidden="true">
        <div className="border-b border-border px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Console</div>
        <div className="min-h-[7.5rem] space-y-2 px-4 py-4 font-mono text-[0.68rem] leading-5">
          {renderedLines.map((line, index) => (
            <div key={lines[index]} className={index === 0 ? 'text-accent' : 'text-text-secondary'}>
              <span className="mr-2 text-text-muted">{index === 0 ? '›' : '·'}</span>
              {line}
              {complete && index === renderedLines.length - 1 ? <span className="console-cursor ml-1 inline-block h-[0.85em] w-[0.5em] bg-accent align-[-0.08em]" /> : null}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function createMotif(title: string, salt = 0) {
  const random = mulberry32(hashString(`${title}:${salt}`));
  const ramp = ' .:-=+*#%@';
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ramp[Math.floor(random() * ramp.length)]).join('')).join('\n');
}

function AsciiMotif({ title, trigger }: { title: string; trigger: number }) {
  const shouldReduceMotion = useReducedMotion();
  const resolved = useMemo(() => createMotif(title), [title]);
  const [glyph, setGlyph] = useState(resolved);
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (!trigger || shouldReduceMotion) {
      setGlyph(resolved);
      setScrambling(false);
      return;
    }

    const startedAt = window.performance.now();
    let frame = 0;
    let timeout: number | undefined;
    setScrambling(true);

    const scramble = () => {
      const progress = Math.min((window.performance.now() - startedAt) / 400, 1);
      const noise = createMotif(title, trigger * 100 + frame);
      let cell = 0;
      setGlyph(Array.from(resolved).map((character, index) => {
        if (character === '\n') return character;
        const next = cell / 63 <= progress ? character : noise[index];
        cell += 1;
        return next;
      }).join(''));

      if (progress < 1) {
        frame += 1;
        timeout = window.setTimeout(scramble, 48);
        return;
      }

      setGlyph(resolved);
      setScrambling(false);
    };

    scramble();
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [resolved, shouldReduceMotion, title, trigger]);

  return (
    <pre aria-hidden="true" className={`mt-0 whitespace-pre font-mono text-[0.48rem] leading-[0.58rem] transition-colors duration-200 lg:mt-5 ${scrambling ? 'text-accent' : 'text-text-muted'}`}>
      {glyph}
    </pre>
  );
}

function ProjectRow({
  project,
  index,
  expanded,
  onToggle,
}: {
  project: ArchiveProject;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const contentId = `archive-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : Math.min((index - featuredProjects.length) * 0.04, 0.2), ease: EASE }}
      className="group relative border-b border-border transition-colors"
    >
      <div className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${project.title} details`}
        onClick={onToggle}
        className="grid w-full items-start gap-5 py-8 text-left focus-visible:outline-offset-4 sm:grid-cols-[3rem_minmax(12rem,1fr)_minmax(16rem,1.15fr)_auto] sm:gap-8 sm:py-10"
      >
        <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-text-muted">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-2xl font-medium tracking-[-0.035em] text-text-primary sm:text-3xl">{project.title}</span>
        <span>
          <span className="block max-w-lg leading-7 text-text-secondary">{project.description}</span>
          <span className="mt-4 block font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">{project.tags.join(', ')}</span>
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-primary transition-colors duration-300 group-hover:border-accent group-hover:text-accent sm:justify-self-end">
          <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={contentId}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-7 border-t border-border py-8 sm:grid-cols-2 sm:gap-10 sm:pl-11">
              <dl className="contents">
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">Problem</dt>
                  <dd className="mt-3 max-w-xl leading-7 text-text-secondary">{project.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-text-muted">System</dt>
                  <dd className="mt-3 max-w-xl leading-7 text-text-secondary">{project.system}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 sm:col-span-2">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="group/link inline-flex min-h-11 items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-primary transition-colors hover:text-accent">
                  View code
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="group/link inline-flex min-h-11 items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-accent">
                    Open project
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
