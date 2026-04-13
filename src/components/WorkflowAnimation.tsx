import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { 
  Zap, BrainCircuit, Globe, Database, Network, Cpu, Bell
} from 'lucide-react';

// ─── Layout constants (SVG coordinate space: 1060 × 430) ───────────────────────
const W = 1060;
const H = 430;

const MODULES = [
  { id: 'trigger',  label: 'Trigger',     icon: Zap,            x:  75, y: 215, num: '01', focus: false },
  { id: 'crm',      label: 'CRM System',  icon: Network,        x: 245, y: 130, num: '02', focus: false },
  { id: 'ai',       label: 'AI Agent',    icon: BrainCircuit,   x: 425, y: 278, num: '03', focus: true  },
  { id: 'backend',  label: 'Backend',     icon: Cpu,            x: 600, y: 182, num: '04', focus: true  },
  { id: 'api',      label: 'API Layer',   icon: Globe,          x: 770, y:  90, num: '05', focus: false },
  { id: 'notify',   label: 'Notify',      icon: Bell,           x: 770, y: 306, num: '06', focus: false },
  { id: 'db',       label: 'Database',    icon: Database,       x: 970, y: 215, num: '07', focus: false },
] as const;

const PATHS = [
  { from: 'trigger', to: 'crm',     d: 'M  75,215 C 140,215 178,130 245,130' },
  { from: 'crm',     to: 'ai',      d: 'M 245,130 C 312,130 358,278 425,278' },
  { from: 'ai',      to: 'backend', d: 'M 425,278 C 492,278 535,182 600,182' },
  { from: 'backend', to: 'api',     d: 'M 600,182 C 668,182 702, 90 770, 90' },
  { from: 'backend', to: 'notify',  d: 'M 600,182 C 668,182 702,306 770,306' },
  { from: 'api',     to: 'db',      d: 'M 770, 90 C 838, 90 902,215 970,215' },
  { from: 'notify',  to: 'db',      d: 'M 770,306 C 838,306 902,215 970,215' },
] as const;

const NODE_W = 128;
const NODE_H =  92;
const PULSE_MS = 900;

// ─── Types ────────────────────────────────────────────────────────────────────
type Pulse = { id: number; pathIndex: number; startTime: number };

// ─── Component ────────────────────────────────────────────────────────────────
export const WorkflowAnimation = () => {
  const [pulses, setPulses]           = useState<Pulse[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const counter = useRef(0);

  // Sequential pulse train
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      const push = (pi: number) => {
        if (cancelled) return;
        setPulses(prev => [...prev.slice(-12), { id: ++counter.current, pathIndex: pi, startTime: Date.now() }]);
      };
      const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

      push(0); await wait(PULSE_MS + 50);
      push(1); await wait(PULSE_MS + 50);
      push(2); await wait(PULSE_MS + 50);
      push(3); push(4); await wait(PULSE_MS + 50);
      push(5); push(6);
    };

    const loop = setInterval(run, 6000);
    run();
    return () => { cancelled = true; clearInterval(loop); };
  }, []);

  // Cleanup stale pulses
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setPulses(p => p.filter(p => now - p.startTime < PULSE_MS + 200));
    }, 500);
    return () => clearInterval(t);
  }, []);

  // Reactive glow on modules
  useAnimationFrame(() => {
    const now = Date.now();
    let hit: string | null = null;
    pulses.forEach(p => {
      const pct = Math.min((now - p.startTime) / PULSE_MS, 1);
      if (pct > 0.75) hit = PATHS[p.pathIndex].to;
      else if (pct < 0.25) hit = PATHS[p.pathIndex].from;
    });
    if (hit !== activeModule) setActiveModule(hit);
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.09)_0%,transparent_70%)] pointer-events-none" />

      {/* Fully-responsive SVG canvas */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-w-full max-h-full"
      >
        <defs>
          {/* Gradient for connection lines */}
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%"  stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter for comet head */}
          <filter id="cometGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for active node */}
          <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Connection paths ── */}
        {PATHS.map((path, i) => (
          <path
            key={`path-${i}`}
            d={path.d}
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.75"
          />
        ))}

        {/* ── Comet pulses (CSS offset-path) ── */}
        <AnimatePresence>
          {pulses.map(p => (
            <motion.g key={p.id}>
              {/* Glow trail */}
              <motion.circle
                r={10}
                fill="hsl(var(--primary))"
                fillOpacity="0"
                initial={{ offsetDistance: '0%', opacity: 0 }}
                animate={{ offsetDistance: '100%', opacity: [0, 0.35, 0] }}
                transition={{ duration: PULSE_MS / 1000, ease: 'linear' }}
                style={{ offsetPath: `path("${PATHS[p.pathIndex].d}")`, filter: 'blur(6px)' }}
              />
              {/* Comet head */}
              <motion.circle
                r={3.5}
                fill="white"
                filter="url(#cometGlow)"
                initial={{ offsetDistance: '0%', opacity: 0 }}
                animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: PULSE_MS / 1000, ease: 'linear' }}
                style={{ offsetPath: `path("${PATHS[p.pathIndex].d}")` }}
              />
            </motion.g>
          ))}
        </AnimatePresence>

        {/* ── Module Cards (foreignObject) ── */}
        {MODULES.map((mod, index) => {
          const isActive = activeModule === mod.id;
          const Icon = mod.icon;

          return (
            <g key={mod.id}>
              {/* Active node glow halo */}
              {(isActive || mod.focus) && (
                <ellipse
                  cx={mod.x}
                  cy={mod.y}
                  rx={NODE_W * 0.7}
                  ry={NODE_H * 0.9}
                  fill="hsl(var(--primary))"
                  fillOpacity={isActive ? 0.12 : 0.04}
                  filter="url(#nodeGlow)"
                />
              )}

              {/* The card itself via foreignObject */}
              <foreignObject
                x={mod.x - NODE_W / 2}
                y={mod.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                overflow="visible"
              >
                <div
                  // @ts-ignore — xmlns needed for foreignObject
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: NODE_W,
                    height: NODE_H,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderRadius: 14,
                    border: `1px solid ${isActive ? 'hsl(var(--primary) / 0.8)' : mod.focus ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--primary) / 0.12)'}`,
                    background: isActive ? 'hsl(var(--primary) / 0.15)' : 'hsl(220 40% 4% / 0.95)',
                    boxShadow: isActive ? '0 0 28px hsl(var(--primary) / 0.3)' : mod.focus ? '0 0 14px hsl(var(--primary) / 0.1)' : 'none',
                    backdropFilter: 'blur(16px)',
                    transition: 'border 0.4s, box-shadow 0.4s, background 0.4s',
                    position: 'relative',
                    overflow: 'visible',
                    userSelect: 'none',
                  }}
                >
                  {/* NODE marker */}
                  <span style={{
                    position: 'absolute', top: 5, right: 7,
                    fontSize: 8, fontWeight: 900, letterSpacing: '0.3em',
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)',
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                  }}>
                    {mod.num}
                  </span>

                  {/* Ping dot */}
                  <span style={{
                    position: 'absolute', top: -4, left: -4,
                    width: 7, height: 7, borderRadius: '50%',
                    background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)',
                    boxShadow: isActive ? '0 0 8px hsl(var(--primary))' : 'none',
                    transition: 'background 0.3s, box-shadow 0.3s',
                  }} />

                  {/* Icon */}
                  <div style={{
                    padding: 10,
                    borderRadius: 11,
                    background: isActive ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--primary) / 0.04)',
                    color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.4s, color 0.4s',
                  }}>
                    <Icon size={21} />
                  </div>

                  {/* Label */}
                  <span style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: isActive ? 'white' : 'hsl(var(--foreground) / 0.55)',
                    transition: 'color 0.4s',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    fontFamily: 'inherit',
                  }}>
                    {mod.label}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WorkflowAnimation;
