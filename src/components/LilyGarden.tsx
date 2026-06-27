import React from 'react';

export default function LilyGarden({ children }: { children: React.ReactNode }) {
  const petals = [
    { left: '5%', dur: '18s', delay: '-3s' },
    { left: '16%', dur: '22s', delay: '-8s' },
    { left: '28%', dur: '26s', delay: '-12s' },
    { left: '42%', dur: '15s', delay: '-5s' },
    { left: '56%', dur: '20s', delay: '-10s' },
    { left: '68%', dur: '24s', delay: '-2s' },
    { left: '82%', dur: '17s', delay: '-7s' },
    { left: '93%', dur: '21s', delay: '-15s' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Layer 1 — sky wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, #eef5fc 0%, #f6f7f5 38%, #faf8f4 70%)' }}
      />
      {/* Sun glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(900px 600px at 78% -8%, rgba(255, 244, 214, 0.55), transparent 65%)',
        }}
      />

      {/* Layer 2 — lily bed */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 inset-x-0 z-0 motion-reduce:animate-none"
        style={{
          height: 'clamp(180px, 28vh, 340px)',
          animation: 'lily-sway 14s ease-in-out infinite alternate',
          transformOrigin: 'bottom center',
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            {/* Trumpet lily, drawn facing up-left ~80x90 units */}
            <g id="lily">
              <path d="M40 70 C18 52 8 28 16 8 C30 18 42 38 44 62 Z" fill="#ffffff" stroke="#dfe5e2" strokeWidth="1.5" />
              <path d="M44 68 C36 42 38 16 52 2 C60 18 58 44 52 66 Z" fill="#fbfcfb" stroke="#dfe5e2" strokeWidth="1.5" />
              <path d="M48 70 C60 48 76 34 92 32 C86 50 70 64 54 72 Z" fill="#ffffff" stroke="#dfe5e2" strokeWidth="1.5" />
              <path d="M46 72 C64 66 80 68 90 78 C76 84 58 82 46 76 Z" fill="#f4f6f4" stroke="#dfe5e2" strokeWidth="1.5" />
              <path d="M42 74 C28 70 16 74 8 84 C20 90 34 86 42 78 Z" fill="#fbfcfb" stroke="#dfe5e2" strokeWidth="1.5" />
              {/* Stamens */}
              <path d="M44 68 L40 44 M46 68 L48 42 M44 68 L52 48" stroke="#c9c2ae" strokeWidth="1.2" />
              <ellipse cx="39" cy="42" rx="3" ry="1.6" fill="#a8821f" transform="rotate(-30 39 42)" />
              <ellipse cx="49" cy="40" rx="3" ry="1.6" fill="#a8821f" transform="rotate(15 49 40)" />
              <ellipse cx="53" cy="46" rx="3" ry="1.6" fill="#a8821f" transform="rotate(40 53 46)" />
            </g>
            {/* Leaf blade */}
            <path id="leaf" d="M0 0 C24 -10 52 -8 78 14 C50 22 22 18 0 0 Z" fill="#5d8a6b" />
          </defs>

          {/* Left cluster — stems */}
          <path d="M80 320 C84 240 78 190 90 150" stroke="#4c7a5d" strokeWidth="5" strokeLinecap="round" />
          <path d="M160 320 C150 250 164 210 156 175" stroke="#5d8a6b" strokeWidth="4" strokeLinecap="round" />
          <path d="M240 320 C236 260 242 220 230 185" stroke="#4c7a5d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 320 C28 270 22 230 34 190" stroke="#5d8a6b" strokeWidth="3" strokeLinecap="round" />
          <path d="M340 320 C330 270 338 240 328 200" stroke="#4c7a5d" strokeWidth="3" strokeLinecap="round" />

          {/* Left leaves */}
          <use href="#leaf" x="56" y="236" transform="rotate(-18 56 236)" />
          <use href="#leaf" x="164" y="252" transform="rotate(156 164 252) scale(-0.8 0.8)" />
          <use href="#leaf" x="224" y="262" transform="rotate(-12 224 262)" />
          <use href="#leaf" x="320" y="280" transform="rotate(148 320 280) scale(-0.6 0.6)" />

          {/* Left blooms */}
          <use href="#lily" x="52" y="92" transform="matrix(1.1 0 0 1.1 0 0)" />
          <use href="#lily" x="126" y="130" transform="rotate(14 140 160) scale(0.8)" />
          <use href="#lily" x="210" y="150" transform="rotate(-8 210 170) scale(0.65)" opacity="0.7" />
          <use href="#lily" x="2" y="140" transform="rotate(-20 10 170) scale(0.7)" opacity="0.6" />
          <use href="#lily" x="310" y="165" transform="rotate(10 310 185) scale(0.55)" opacity="0.5" />

          {/* Right cluster — stems */}
          <path d="M1120 320 C1124 240 1118 190 1130 150" stroke="#4c7a5d" strokeWidth="5" strokeLinecap="round" />
          <path d="M1200 320 C1190 250 1204 210 1196 175" stroke="#5d8a6b" strokeWidth="4" strokeLinecap="round" />
          <path d="M1280 320 C1276 260 1282 220 1270 185" stroke="#4c7a5d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M1380 320 C1388 270 1382 230 1394 190" stroke="#5d8a6b" strokeWidth="4" strokeLinecap="round" />
          <path d="M1060 320 C1050 270 1058 240 1048 200" stroke="#4c7a5d" strokeWidth="3" strokeLinecap="round" />

          {/* Right leaves */}
          <use href="#leaf" x="1096" y="236" transform="rotate(16 1096 236)" />
          <use href="#leaf" x="1204" y="252" transform="rotate(-140 1204 252) scale(-0.8 0.8)" />
          <use href="#leaf" x="1264" y="262" transform="rotate(10 1264 262)" />
          <use href="#leaf" x="1370" y="280" transform="rotate(-150 1370 280) scale(-0.6 0.6)" />
          <use href="#leaf" x="1060" y="285" transform="rotate(-20 1060 285) scale(-0.7 0.7)" />

          {/* Right blooms */}
          <use href="#lily" x="1092" y="92" transform="matrix(1.1 0 0 1.1 0 0)" />
          <use href="#lily" x="1166" y="130" transform="rotate(-14 1180 160) scale(0.8)" />
          <use href="#lily" x="1250" y="150" transform="rotate(8 1250 170) scale(0.65)" opacity="0.7" />
          <use href="#lily" x="1352" y="110" transform="rotate(22 1360 150) scale(0.85)" />
          <use href="#lily" x="1050" y="165" transform="rotate(-10 1050 185) scale(0.55)" opacity="0.5" />

          {/* Center — sparse, distant */}
          <path d="M580 320 C582 280 578 260 584 230" stroke="#5d8a6b" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          <path d="M780 320 C776 290 780 270 774 250" stroke="#5d8a6b" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <use href="#lily" x="570" y="210" transform="rotate(4 580 230) scale(0.35)" opacity="0.3" />
          <use href="#lily" x="768" y="230" transform="rotate(-6 775 250) scale(0.3)" opacity="0.25" />
        </svg>
      </div>

      {/* Layer 3 — drifting petals */}
      {petals.map((petal, i) => (
        <div
          key={i}
          data-testid="petal-layer"
          aria-hidden="true"
          className="pointer-events-none fixed z-0 motion-reduce:hidden"
          style={{
            left: petal.left,
            top: 0,
            animation: `petal-fall ${petal.dur} ease-in-out ${petal.delay} infinite`,
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5 C3 1 9 0 13 3 C10 8 4 10 1 5 Z" fill="#ffffff" stroke="#e7e3da" strokeWidth="0.8" />
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
