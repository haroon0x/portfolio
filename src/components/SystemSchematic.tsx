import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';

interface SystemSchematicProps {
  project: 'Wake AI' | 'DeadDrop' | 'OutSync';
}

const summaries = {
  'Wake AI': 'Wake AI: capture to Room database to hybrid retrieval to cited answer.',
  DeadDrop: 'DeadDrop: hosted inbox polled by an outbound worker, then processed by a local agent into a diff receipt.',
  OutSync: 'OutSync: API request writes data and an outbox row in one transaction, then a worker publishes to Kafka.',
};

function Edge({ id, d, delay, revealed, markerId }: { id: string; d: string; delay: number; revealed: boolean; markerId: string }) {
  const maskId = `${id}-mask`;

  return (
    <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="320">
          <path
            d={d}
            pathLength="1"
            className={`system-schematic-edge-mask ${revealed ? 'is-revealed' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
          />
        </mask>
      </defs>
      <path id={id} d={d} className="system-schematic-edge" mask={`url(#${maskId})`} markerEnd={`url(#${markerId})`} />
    </>
  );
}

function Node({ x, y, width, label, delay, revealed }: { x: number; y: number; width: number; label: string; delay: number; revealed: boolean }) {
  return (
    <g
      className={`system-schematic-node ${revealed ? 'is-revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <rect x={x} y={y} width={width} height="42" rx="1" />
      <text x={x + width / 2} y={y + 25} textAnchor="middle">{label}</text>
    </g>
  );
}

function FlowDot({ pathId, duration, begin }: { pathId: string; duration: string; begin: string }) {
  return (
    <circle r="3.5" className="system-schematic-dot">
      <animateMotion dur={duration} begin={begin} repeatCount="indefinite">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

function WakeDiagram({ id, revealed, animate }: { id: string; revealed: boolean; animate: boolean }) {
  const edges = [
    { id: `${id}-wake-1`, d: 'M240 82 L240 106' },
    { id: `${id}-wake-2`, d: 'M240 148 L240 172' },
    { id: `${id}-wake-3`, d: 'M240 214 L240 238' },
  ];

  return (
    <>
      <rect x="103" y="22" width="274" height="276" rx="22" className="system-schematic-zone" />
      <line x1="208" y1="38" x2="272" y2="38" className="system-schematic-detail" />
      <Node x={158} y={40} width={164} label="CAPTURE" delay={80} revealed={revealed} />
      <Node x={158} y={106} width={164} label="ROOM DB" delay={150} revealed={revealed} />
      <Node x={138} y={172} width={204} label="HYBRID RETRIEVAL" delay={220} revealed={revealed} />
      <Node x={158} y={238} width={164} label="CITED ANSWER" delay={290} revealed={revealed} />
      {edges.map((edge, index) => <Edge key={edge.id} {...edge} delay={120 + index * 80} revealed={revealed} markerId={`${id}-arrow`} />)}
      {animate ? (
        <>
          <FlowDot pathId={edges[0].id} duration="1.8s" begin="0s" />
          <FlowDot pathId={edges[1].id} duration="1.8s" begin="0.55s" />
          <FlowDot pathId={edges[2].id} duration="1.8s" begin="1.1s" />
        </>
      ) : null}
    </>
  );
}

function DeadDropDiagram({ id, revealed, animate }: { id: string; revealed: boolean; animate: boolean }) {
  const edges = [
    { id: `${id}-drop-poll`, d: 'M176 116 C224 70 264 70 306 116' },
    { id: `${id}-drop-return`, d: 'M306 142 C258 188 216 188 176 142' },
    { id: `${id}-drop-agent`, d: 'M354 158 L354 192' },
    { id: `${id}-drop-receipt`, d: 'M306 240 C254 274 218 274 174 240' },
  ];

  return (
    <>
      <rect x="24" y="52" width="188" height="216" className="system-schematic-zone" />
      <rect x="268" y="52" width="188" height="216" className="system-schematic-zone" />
      <text x="42" y="78" className="system-schematic-zone-label">HOSTED</text>
      <text x="286" y="78" className="system-schematic-zone-label">LOCAL MACHINE</text>
      <Node x={54} y={96} width={122} label="INBOX" delay={80} revealed={revealed} />
      <Node x={306} y={116} width={96} label="WORKER" delay={150} revealed={revealed} />
      <Node x={298} y={192} width={112} label="AGENT" delay={220} revealed={revealed} />
      <Node x={48} y={218} width={126} label="DIFF RECEIPT" delay={290} revealed={revealed} />
      {edges.map((edge, index) => <Edge key={edge.id} {...edge} delay={120 + index * 65} revealed={revealed} markerId={`${id}-arrow`} />)}
      {animate ? (
        <>
          <FlowDot pathId={edges[0].id} duration="2.6s" begin="0s" />
          <FlowDot pathId={edges[1].id} duration="2.6s" begin="1.2s" />
          <FlowDot pathId={edges[3].id} duration="2.2s" begin="0.7s" />
        </>
      ) : null}
    </>
  );
}

function OutSyncDiagram({ id, revealed, animate }: { id: string; revealed: boolean; animate: boolean }) {
  const edges = [
    { id: `${id}-out-api`, d: 'M112 160 L154 160' },
    { id: `${id}-out-worker`, d: 'M306 160 L340 160' },
    { id: `${id}-out-kafka`, d: 'M404 160 L438 160' },
  ];

  return (
    <>
      <Node x={28} y={139} width={84} label="API" delay={70} revealed={revealed} />
      <rect x="154" y="74" width="152" height="172" className="system-schematic-zone" />
      <path d="M168 98 h-10 v124 h10" className="system-schematic-bracket" />
      <text x="174" y="98" className="system-schematic-zone-label">ONE TRANSACTION</text>
      <Node x={184} y={116} width={98} label="DATA" delay={140} revealed={revealed} />
      <Node x={184} y={172} width={98} label="OUTBOX" delay={210} revealed={revealed} />
      <Node x={340} y={139} width={64} label="WORKER" delay={280} revealed={revealed} />
      <Node x={438} y={139} width={40} label="K" delay={350} revealed={revealed} />
      <text x="458" y="208" textAnchor="middle" className="system-schematic-zone-label">KAFKA</text>
      {edges.map((edge, index) => <Edge key={edge.id} {...edge} delay={120 + index * 100} revealed={revealed} markerId={`${id}-arrow`} />)}
      {animate ? (
        <>
          <FlowDot pathId={edges[0].id} duration="2.1s" begin="0s" />
          <FlowDot pathId={edges[1].id} duration="2.1s" begin="0.65s" />
          <FlowDot pathId={edges[2].id} duration="2.1s" begin="1.3s" />
        </>
      ) : null}
    </>
  );
}

export default function SystemSchematic({ project }: SystemSchematicProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const rotateX = useSpring(0, { stiffness: 160, damping: 24, mass: 0.7 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 24, mass: 0.7 });
  const rawId = useId().replace(/:/g, '');
  const id = `schematic-${rawId}`;
  const revealed = drawn || Boolean(shouldReduceMotion);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setDrawn(true);
    }, { threshold: 0.25 });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(y * -3);
    rotateY.set(x * 3);
  };

  const resetParallax = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div ref={wrapperRef} className="system-schematic-shell">
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={resetParallax}
        style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        className="system-schematic-frame"
      >
        <svg viewBox="0 0 480 320" role="img" aria-labelledby={`${id}-title ${id}-description`} className="system-schematic-svg">
          <title id={`${id}-title`}>{`${project} system schematic`}</title>
          <desc id={`${id}-description`}>{summaries[project]}</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 Z" className="system-schematic-arrow" />
            </marker>
          </defs>
          <rect x="0.5" y="0.5" width="479" height="319" className="system-schematic-boundary" />
          <text x="18" y="24" className="system-schematic-caption">SYSTEM MAP / {project.toUpperCase()}</text>
          {project === 'Wake AI' ? <WakeDiagram id={id} revealed={revealed} animate={visible && !shouldReduceMotion} /> : null}
          {project === 'DeadDrop' ? <DeadDropDiagram id={id} revealed={revealed} animate={visible && !shouldReduceMotion} /> : null}
          {project === 'OutSync' ? <OutSyncDiagram id={id} revealed={revealed} animate={visible && !shouldReduceMotion} /> : null}
        </svg>
      </motion.div>
    </div>
  );
}
