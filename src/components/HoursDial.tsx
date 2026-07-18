import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const segments = [
  { id: 'deep-work', label: 'Deep work', hours: 6, treatment: 'accent' },
  { id: 'oss-community', label: 'OSS / community', hours: 3, treatment: 'strong' },
  { id: 'training', label: 'Training', hours: 1, treatment: 'thin' },
  { id: 'reading', label: 'Reading', hours: 2, treatment: 'muted' },
  { id: 'sleep', label: 'Sleep', hours: 7, treatment: 'wide' },
  { id: 'margin', label: 'Margin', hours: 5, treatment: 'outline' },
] as const;

const radius = 112;
const center = 160;

function polarToCartesian(angle: number, distance = radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: center + distance * Math.cos(radians),
    y: center + distance * Math.sin(radians),
  };
}

function describeArc(startAngle: number, endAngle: number) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function HoursDial() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const activeId = hovered ?? selected;
  const activeSegment = segments.find((segment) => segment.id === activeId);
  let angle = 0;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<SVGPathElement>, id: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setSelected((current) => current === id ? null : id);
  };

  return (
    <div ref={wrapperRef} className="hours-dial">
      <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">About / daily orbit</p>
      <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
        <svg viewBox="0 0 320 320" role="group" aria-label="A 24-hour dial showing Haroon's daily allocation" className="h-full w-full overflow-visible">
          <circle cx={center} cy={center} r={radius} className="hours-dial-track" />
          <circle cx={center} cy={center} r="78" className="hours-dial-inner" />
          {segments.map((segment, index) => {
            const startAngle = angle;
            const sweep = segment.hours / 24 * 360;
            const endAngle = startAngle + sweep;
            const path = describeArc(startAngle + 1.5, endAngle - 1.5);
            const midpoint = startAngle + sweep / 2;
            const lift = polarToCartesian(midpoint, 4);
            const translateX = lift.x - center;
            const translateY = lift.y - center;
            const active = activeId === segment.id;
            angle = endAngle;

            return (
              <motion.path
                key={segment.id}
                d={path}
                pathLength="1"
                role="button"
                tabIndex={0}
                aria-label={`${segment.label}, ${segment.hours} hours`}
                aria-pressed={selected === segment.id}
                initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={revealed || shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.58, delay: shouldReduceMotion ? 0 : index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                onPointerEnter={() => setHovered(segment.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(segment.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected((current) => current === segment.id ? null : segment.id)}
                onKeyDown={(event) => handleKeyDown(event, segment.id)}
                className={`hours-dial-arc hours-dial-arc-${segment.treatment} ${active ? 'is-active' : ''}`}
                style={{ transform: active ? `translate(${translateX}px, ${translateY}px)` : 'translate(0, 0)' }}
              />
            );
          })}
          <text x={center} y="148" textAnchor="middle" className="hours-dial-readout-primary">
            {activeSegment ? activeSegment.label.toUpperCase() : '24H'}
          </text>
          <text x={center} y="174" textAnchor="middle" className="hours-dial-readout-secondary">
            {activeSegment ? `${activeSegment.hours}H` : 'INDIA · GLOBAL'}
          </text>
          <line x1="160" y1="24" x2="160" y2="36" className="hours-dial-tick" />
          <line x1="284" y1="160" x2="296" y2="160" className="hours-dial-tick" />
          <line x1="160" y1="284" x2="160" y2="296" className="hours-dial-tick" />
          <line x1="24" y1="160" x2="36" y2="160" className="hours-dial-tick" />
        </svg>
        <span className="sr-only" aria-live="polite">
          {activeSegment ? `${activeSegment.label}, ${activeSegment.hours} hours` : '24 hours, India, global'}
        </span>
      </div>
      <ul className="sr-only">
        {segments.map((segment) => <li key={segment.id}>{segment.label}: {segment.hours} hours</li>)}
      </ul>
    </div>
  );
}
