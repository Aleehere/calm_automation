import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Zap, BrainCircuit, Globe, Database, Mail, Users, FileText,
  Bot, MessageSquare, BarChart3, ShoppingCart, Bell, Cpu,
  Network, CheckCircle, ArrowUpRight, X, Play
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkflowNode {
  id: string;
  label: string;
  icon: React.ElementType;
}
interface System {
  id: string;
  title: string;
  description: string;
  stack: string[];
  results: string[];
  category: string;
  screenshot: string;
  problem: string;
  howItWorks: string[];
  flow: WorkflowNode[];
}

// ─── System Data ──────────────────────────────────────────────────────────────
const SYSTEMS: System[] = [
  {
    id: 'lead-gen',
    title: 'AI Lead Generation Pipeline',
    description: 'Automated lead enrichment and qualification using Google Forms, Apollo, Apify, OpenAI, and Google Sheets.',
    stack: ['Make.com', 'OpenAI', 'Apify', 'Google Sheets', 'Apollo'],
    results: ['+300% lead volume', 'Saved 20 hrs/week', '2,000+ leads processed', 'Near-zero manual effort'],
    category: 'AI Pipeline',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
    problem: 'Sales team was manually researching leads, spending 20+ hours per week on enrichment with inconsistent data quality and slow turnaround.',
    howItWorks: [
      'A Google Form submission triggers the pipeline',
      'Apify scrapes and enriches the lead data from multiple sources',
      'OpenAI analyzes and qualifies the lead based on ICP criteria',
      'Qualified leads are pushed to Google Sheets and the CRM automatically',
    ],
    flow: [
      { id: 'trigger', label: 'Form', icon: Zap },
      { id: 'scrape', label: 'Apify', icon: Globe },
      { id: 'ai', label: 'OpenAI', icon: BrainCircuit },
      { id: 'sheet', label: 'Sheets', icon: Database },
      { id: 'out', label: 'CRM', icon: CheckCircle },
    ],
  },
  {
    id: 'email-ai',
    title: 'AI Email & Meeting Automation',
    description: 'AI-driven system to analyze inbound emails, maintain context memory, check availability, book meetings, and send automated responses.',
    stack: ['n8n', 'AI Agents', 'Gmail API', 'Calendar API', 'GPT-4'],
    results: ['0 manual replies', '100% response rate', '3hr avg booking time', 'Context-aware replies'],
    category: 'AI Agent',
    screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900',
    problem: 'Business was missing inbound leads due to slow email responses and manual calendar management — losing potential clients to faster competitors.',
    howItWorks: [
      'Inbound emails are captured and routed to the AI agent',
      'The agent reads the email, classifies intent, and checks memory context',
      'Availability is checked via Calendar API in real-time',
      'A personalized reply is drafted and sent — meeting links included',
    ],
    flow: [
      { id: 'email', label: 'Email', icon: Mail },
      { id: 'ai', label: 'AI Agent', icon: BrainCircuit },
      { id: 'cal', label: 'Calendar', icon: CheckCircle },
      { id: 'reply', label: 'Reply', icon: Mail },
    ],
  },
  {
    id: 'order-mon',
    title: 'Unfulfilled Order Monitoring',
    description: 'n8n workflow to monitor Shopify orders every 3 hours and automatically flag unfulfilled orders older than 72 hours into Monday.com.',
    stack: ['n8n', 'Shopify', 'Monday.com', 'Slack'],
    results: ['0 missed orders', '100% visibility', 'Real-time Slack alerts', 'Reduced chargebacks'],
    category: 'Ops Automation',
    screenshot: '/unfulfilled-automation.png',
    problem: 'Operations team had no visibility into aging unfulfilled orders, causing customer complaints and chargebacks due to delayed fulfillment.',
    howItWorks: [
      'n8n polls Shopify every 3 hours for all open orders',
      'A filter checks which orders are older than 72 hours and unfulfilled',
      'Flagged orders are automatically created as tasks in Monday.com',
      'Ops team is notified via Slack with order details and urgency level',
    ],
    flow: [
      { id: 'shopify', label: 'Shopify', icon: ShoppingCart },
      { id: 'check', label: 'Filter', icon: Cpu },
      { id: 'monday', label: 'Monday', icon: BarChart3 },
      { id: 'slack', label: 'Alert', icon: Bell },
    ],
  },
  {
    id: 'crm-sync',
    title: 'Airtable API Workflow Orchestration',
    description: 'Make.com automation using routers and iterators to sync, branch, and process Airtable records across multiple workflows.',
    stack: ['Make.com', 'Airtable', 'HTTP APIs', 'Webhooks'],
    results: ['5 systems synced', '99.9% uptime', '10k+ records/day', 'Zero data loss'],
    category: 'Data Pipeline',
    screenshot: '/airtable-workflow.png',
    problem: 'Data was siloed across Airtable, CRM, and external APIs with no real-time synchronization — causing inconsistent records and manual data entry.',
    howItWorks: [
      'A webhook or schedule triggers the orchestration workflow',
      'Router logic branches records into appropriate sub-flows',
      'Iterators process each record and apply transformation logic',
      'Processed data is synced back to all connected systems via APIs',
    ],
    flow: [
      { id: 'airtable', label: 'Airtable', icon: Database },
      { id: 'router', label: 'Router', icon: Network },
      { id: 'api', label: 'APIs', icon: Globe },
      { id: 'sync', label: 'Sync', icon: CheckCircle },
    ],
  },
  {
    id: 'contract',
    title: 'Contract Royalty Extraction',
    description: 'Extracted structured royalty data from contracts and generated Excel reports automatically using AI parsing.',
    stack: ['n8n', 'AI Parsing', 'Excel', 'Document AI'],
    results: ['95% accuracy', 'Saved 15 hrs/week', '500+ contracts processed', 'Automated reports'],
    category: 'AI Extraction',
    screenshot: '/contract-royalty.png',
    problem: 'Legal and finance teams were manually extracting royalty clauses from hundreds of contracts — a slow, error-prone process taking 15+ hours per week.',
    howItWorks: [
      'Contract PDFs are uploaded and ingested into the pipeline',
      'AI parses the document and extracts royalty-related clauses',
      'Data is structured into predefined fields and validated',
      'Excel reports are auto-generated and delivered to stakeholders',
    ],
    flow: [
      { id: 'doc', label: 'PDF', icon: FileText },
      { id: 'ai', label: 'AI Parse', icon: BrainCircuit },
      { id: 'struct', label: 'Structure', icon: Cpu },
      { id: 'excel', label: 'Excel', icon: BarChart3 },
    ],
  },
  {
    id: 'complaint',
    title: 'AI Complaint Classification',
    description: 'n8n workflow using AI Agents to analyze form submissions, classify complaints vs feature requests, create records, and notify teams.',
    stack: ['n8n', 'AI Agents', 'Slack', 'Notion'],
    results: ['98% accuracy', 'Instant triage', '0 manual reviews', 'Full audit trail'],
    category: 'AI Agent',
    screenshot: '/ai-complaint-classification.png',
    problem: 'Support team was manually reading and routing hundreds of submissions per week — causing delays, mislabeling, and missed critical issues.',
    howItWorks: [
      'Form submissions are captured and sent to the AI agent',
      'The agent analyzes tone, intent, and content of the submission',
      'It classifies the input as Bug, Feature Request, Complaint, or Inquiry',
      'A Notion record is created and the relevant team is notified via Slack',
    ],
    flow: [
      { id: 'form', label: 'Form', icon: Zap },
      { id: 'ai', label: 'AI Agent', icon: Bot },
      { id: 'classify', label: 'Classify', icon: BrainCircuit },
      { id: 'slack', label: 'Notify', icon: Bell },
    ],
  },
  {
    id: 'commerce',
    title: 'AI Commerce Assistant',
    description: 'Conversational AI commerce assistant that handles product queries and order flow via Telegram integrated with Shopify.',
    stack: ['AI Agents', 'Telegram', 'Shopify', 'OpenAI'],
    results: ['24/7 operation', '+40% conversion', '1k+ queries/day', 'Instant responses'],
    category: 'Conversational AI',
    screenshot: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=900',
    problem: 'E-commerce customers were abandoning carts due to unanswered product questions and slow support — especially outside business hours.',
    howItWorks: [
      'Customer sends a message on Telegram',
      'AI agent understands the query and fetches product/order data from Shopify',
      'A personalized, context-aware response is generated',
      'If needed, the agent escalates to human support automatically',
    ],
    flow: [
      { id: 'tele', label: 'Telegram', icon: MessageSquare },
      { id: 'ai', label: 'AI Agent', icon: BrainCircuit },
      { id: 'shopify', label: 'Shopify', icon: ShoppingCart },
      { id: 'reply', label: 'Response', icon: CheckCircle },
    ],
  },
  {
    id: 'followup',
    title: 'Automated Lead Follow-Up',
    description: 'Automated follow-up engine that triggers personalized responses based on CRM activity and engagement tracking.',
    stack: ['Make.com', 'CRM', 'Email API', 'Analytics'],
    results: ['+45% reply rate', 'Full automation', '5-step sequences', 'Behavior-triggered'],
    category: 'Sales Automation',
    screenshot: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900',
    problem: 'Sales reps were forgetting to follow up with leads, or doing so at the wrong time — resulting in cold leads and lost deals.',
    howItWorks: [
      'CRM tracks lead activity and triggers the follow-up engine on key events',
      'The system selects the right message template based on lead stage',
      'Personalized emails are sent at optimal times in a 5-step sequence',
      'Engagement is tracked and sequences adapt based on response behavior',
    ],
    flow: [
      { id: 'crm', label: 'CRM', icon: Users },
      { id: 'trigger', label: 'Trigger', icon: Zap },
      { id: 'ai', label: 'Personalize', icon: BrainCircuit },
      { id: 'email', label: 'Email', icon: Mail },
    ],
  },
];

// ─── Floating Preview Panel ───────────────────────────────────────────────────
interface PreviewState { system: System; x: number; y: number; }

const FloatingPreview = ({ preview }: { preview: PreviewState }) => {
  const PREVIEW_W = 300;
  const PREVIEW_H = 190;
  const rawX = useMotionValue(preview.x);
  const rawY = useMotionValue(preview.y);
  const springX = useSpring(rawX, { stiffness: 280, damping: 30, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 30, mass: 0.6 });
  const imgX = useTransform(springX, (v) => (v / window.innerWidth - 0.5) * -16);
  const imgY = useTransform(springY, (v) => (v / window.innerHeight - 0.5) * -12);
  rawX.set(preview.x);
  rawY.set(preview.y);
  const left = useTransform(springX, (v) => Math.min(Math.max(v + 28, 16), window.innerWidth - PREVIEW_W - 24));
  const top = useTransform(springY, (v) => Math.min(Math.max(v - 60, 16), window.innerHeight - PREVIEW_H - 24));

  return (
    <motion.div
      key={preview.system.id}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ left, top, width: PREVIEW_W, height: PREVIEW_H, position: 'fixed', zIndex: 9998, pointerEvents: 'none' }}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-[#010812]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(var(--primary),0.18),0_20px_60px_rgba(0,0,0,0.7)]"
    >
      <motion.div className="absolute inset-0 scale-[1.15]" style={{ x: imgX, y: imgY }}>
        <img src={preview.system.screenshot} alt={preview.system.title} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#010812]/95 via-[#010812]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 mb-0.5">{preview.system.category}</p>
          <p className="text-[11px] font-bold text-white/90 leading-tight line-clamp-1">{preview.system.title}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">Live</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/40" />
    </motion.div>
  );
};

// ─── Full Workflow (Modal) ────────────────────────────────────────────────────
const FullWorkflow = ({
  flow,
  onActiveChange,
}: {
  flow: WorkflowNode[];
  onActiveChange?: (idx: number) => void;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const STEP_DURATION = 1100;
  const prevIdxRef = useRef(-1);

  useAnimationFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const cycle = elapsed % (flow.length * STEP_DURATION);
    const newIdx = Math.floor(cycle / STEP_DURATION);
    setActiveIdx(newIdx);
    setPulseProgress((cycle % STEP_DURATION) / STEP_DURATION);
    if (newIdx !== prevIdxRef.current) {
      prevIdxRef.current = newIdx;
      onActiveChange?.(newIdx);
    }
  });

  return (
    <div className="flex items-center justify-center gap-0 w-full py-6 px-4">
      {flow.map((node, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        const Icon = node.icon;
        return (
          <div key={node.id} className="flex items-center flex-1 min-w-0">
            <div className="relative flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                ${isActive ? 'bg-primary/20 border-primary/80 shadow-[0_0_28px_rgba(var(--primary),0.5)] scale-110'
                  : isPast ? 'bg-primary/10 border-primary/30' : 'bg-primary/[0.04] border-primary/10'}`}>
                <Icon size={22} className={`transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-primary/60' : 'text-primary/25'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-foreground/50' : 'text-foreground/25'}`}>
                {node.label}
              </span>
            </div>
            {i < flow.length - 1 && (
              <div className="relative flex-1 mx-2 h-[2px] rounded overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 rounded" />
                {i === activeIdx && (
                  <motion.div className="absolute inset-y-0 left-0 bg-primary/70 rounded shadow-[0_0_8px_rgba(var(--primary),0.9)]"
                    style={{ width: `${pulseProgress * 100}%` }} />
                )}
                {i < activeIdx && <div className="absolute inset-0 bg-primary/30 rounded" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── System Modal ─────────────────────────────────────────────────────────────
const SystemModal = ({ system, onClose }: { system: System; onClose: () => void }) => {
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [imageGlowing, setImageGlowing] = useState(false);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flash the image glow whenever the active node changes
  const handleActiveChange = useCallback((idx: number) => {
    setActiveNodeIdx(idx);
    setImageGlowing(true);
    if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    glowTimerRef.current = setTimeout(() => setImageGlowing(false), 700);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
    >
      {/* Backdrop */}
      <motion.div className="absolute inset-0 bg-background/85 backdrop-blur-2xl" onClick={onClose} />

      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-primary/20 bg-[#020617]/98 backdrop-blur-3xl shadow-[0_0_80px_rgba(var(--primary),0.15),0_40px_100px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Top edge glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 -top-px h-32 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-primary/5 border border-primary/15 text-foreground/50 hover:text-white hover:border-primary/40 hover:bg-primary/10 transition-all duration-300">
          <X size={18} />
        </button>

        <div className="p-6 md:p-9 flex flex-col gap-7">

          {/* ── Header ── */}
          <div className="flex items-start gap-4 pr-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 bg-primary/5 border border-primary/15 rounded-full px-3 py-1">
                  {system.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary/50">System Active</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gradient leading-tight">
                {system.title}
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl">{system.description}</p>
            </div>
          </div>

          {/* ── MAIN VISUAL: Workflow LEFT + Image RIGHT ── */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4 items-stretch">

            {/* LEFT — Animated Workflow */}
            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] overflow-hidden flex flex-col">
              <div className="px-5 pt-4 pb-1 border-b border-primary/[0.07] flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Automation Flow</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Running</span>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <FullWorkflow flow={system.flow} onActiveChange={handleActiveChange} />
              </div>
              {/* Active node label */}
              <div className="px-5 pb-4 flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/30">Processing:</span>
                <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">
                  {system.flow[activeNodeIdx]?.label ?? '—'}
                </span>
              </div>
            </div>

            {/* RIGHT — Project Image with reactive glow */}
            <motion.div
              className="relative rounded-2xl overflow-hidden border-2 transition-all duration-500"
              style={{
                borderColor: imageGlowing ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--primary) / 0.1)',
                boxShadow: imageGlowing
                  ? '0 0 40px hsl(var(--primary) / 0.35), 0 0 80px hsl(var(--primary) / 0.12)'
                  : '0 0 0px transparent',
              }}
            >
              {/* Image */}
              <motion.img
                src={system.screenshot}
                alt={system.title}
                className="w-full h-full object-cover min-h-[180px]"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />

              {/* Connected indicator — pulses when node fires */}
              <div className="absolute top-3 left-3">
                <motion.div
                  animate={imageGlowing ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.4 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#020617]/80 border border-primary/25 backdrop-blur-sm"
                >
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${imageGlowing ? 'bg-primary' : 'bg-primary/40'}`} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary/70">
                    {imageGlowing ? system.flow[activeNodeIdx]?.label : 'Preview'}
                  </span>
                </motion.div>
              </div>

              {/* Bottom tag */}
              <div className="absolute bottom-3 right-3">
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/30 bg-[#020617]/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-primary/10">
                  System UI
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Details Grid ── */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Problem Solved</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{system.problem}</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">How It Works</p>
              <ol className="flex flex-col gap-2">
                {system.howItWorks.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-foreground/65 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {system.stack.map(s => (
                  <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/8 text-primary/80 border border-primary/20">{s}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Impact & Results</p>
              <div className="grid grid-cols-2 gap-2">
                {system.results.map(r => (
                  <div key={r} className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-[10px] font-bold text-primary/90">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-primary/[0.08]">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300">
              <Play size={14} />
              Request Case Study
            </button>
            <a href="#contact" onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-primary/25 bg-primary/5 text-foreground/70 font-bold text-sm hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              Build Something Similar
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.div>
    </motion.div>
  );
};

// ─── Mini Workflow (Card) ─────────────────────────────────────────────────────
const MiniWorkflow = ({ flow }: { flow: WorkflowNode[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const STEP_DURATION = 900;

  useAnimationFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const cycle = elapsed % (flow.length * STEP_DURATION);
    setActiveIdx(Math.floor(cycle / STEP_DURATION));
    setPulseProgress((cycle % STEP_DURATION) / STEP_DURATION);
  });

  return (
    <div className="relative w-full flex items-center justify-between px-2 py-4 gap-0">
      {flow.map((node, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        const Icon = node.icon;
        return (
          <div key={node.id} className="flex items-center flex-1 min-w-0">
            <div className="relative flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500
                ${isActive ? 'bg-primary/20 border-primary/70 shadow-[0_0_16px_rgba(var(--primary),0.4)]'
                  : isPast ? 'bg-primary/10 border-primary/30' : 'bg-primary/[0.03] border-primary/10'}`}>
                <Icon size={14} className={`transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-primary/60' : 'text-primary/30'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-primary' : 'text-foreground/30'}`}>
                {node.label}
              </span>
            </div>
            {i < flow.length - 1 && (
              <div className="relative flex-1 mx-1 h-[2px] rounded overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 rounded" />
                {i === activeIdx && (
                  <motion.div className="absolute inset-y-0 left-0 bg-primary/60 rounded shadow-[0_0_6px_rgba(var(--primary),0.8)]"
                    style={{ width: `${pulseProgress * 100}%` }} />
                )}
                {i < activeIdx && <div className="absolute inset-0 bg-primary/25 rounded" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── System Card ──────────────────────────────────────────────────────────────
interface SystemCardProps {
  system: System;
  index: number;
  onHover: (s: System | null, x: number, y: number) => void;
  onClick: (s: System) => void;
}

const SystemCard = ({ system, index, onHover, onClick }: SystemCardProps) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => { onHover(system, e.clientX, e.clientY); }, [system, onHover]);
  const handleMouseEnter = useCallback((e: React.MouseEvent) => { setIsHovered(true); onHover(system, e.clientX, e.clientY); }, [system, onHover]);
  const handleMouseLeave = useCallback(() => { setIsHovered(false); onHover(null, 0, 0); }, [onHover]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(system)}
      className={`group relative flex flex-col rounded-2xl border backdrop-blur-xl overflow-hidden cursor-pointer
        transition-all duration-500
        ${isHovered ? 'border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.12)] -translate-y-1.5' : 'border-primary/10'}
        bg-[#020617]/90`}
    >
      {/* Category badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/50 bg-primary/5 border border-primary/15 rounded-full px-2.5 py-1">
          {system.category}
        </span>
      </div>

      {/* Click hint — appears on hover */}
      <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/25">
          <Play size={8} className="text-primary" />
          <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">Explore</span>
        </div>
      </div>

      {/* Mini Workflow */}
      <div className={`relative px-4 pb-2 pt-6 border-b transition-all duration-500 ${isHovered ? 'border-primary/15' : 'border-primary/[0.06]'}`}>
        <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.06)_0%,transparent_70%)]" />
        </div>
        <MiniWorkflow flow={system.flow} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        <h3 className={`text-base font-extrabold leading-snug tracking-tight transition-colors duration-300 ${isHovered ? 'text-white' : 'text-foreground/90'}`}>
          {system.title}
        </h3>
        <p className="text-xs text-foreground/50 leading-relaxed font-light line-clamp-2">{system.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {system.stack.slice(0, 3).map(s => (
            <span key={s} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/8 text-primary/70 border border-primary/15">{s}</span>
          ))}
          {system.stack.length > 3 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md text-foreground/30">+{system.stack.length - 3}</span>
          )}
        </div>
        <div className={`mt-auto pt-4 border-t transition-colors duration-500 ${isHovered ? 'border-primary/20' : 'border-primary/[0.06]'}`}>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Key Results</p>
          <div className="flex flex-col gap-1">
            {system.results.slice(0, 3).map(r => (
              <div key={r} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className={`text-[10px] font-bold transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground/60'}`}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-[2px] transition-all duration-500 ${isHovered ? 'bg-primary/40 shadow-[0_0_12px_rgba(var(--primary),0.6)]' : 'bg-transparent'}`} />
    </motion.div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const PortfolioSection = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);

  const handleHover = useCallback((system: System | null, x: number, y: number) => {
    setPreview(system ? { system, x, y } : null);
  }, []);

  const handleClick = useCallback((system: System) => {
    setPreview(null);
    setActiveSystem(system);
  }, []);

  return (
    <section id="portfolio" className="relative py-24 overflow-hidden bg-background">
      <div className="absolute top-1/4 left-1/3 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[500px] bg-secondary/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Production Systems</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient mb-5">
            Automation Systems<br className="hidden md:block" /> I've Built
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Real-world workflows, AI systems, and scalable automation pipelines designed to eliminate manual work and drive measurable results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SYSTEMS.map((system, i) => (
            <SystemCard key={system.id} system={system} index={i} onHover={handleHover} onClick={handleClick} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 flex justify-center">
          <a href="#contact" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-primary/25 bg-primary/5 text-sm font-bold text-foreground/70 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
            Want a custom system built?
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>

      {/* Floating Preview */}
      <AnimatePresence>
        {preview && !activeSystem && <FloatingPreview preview={preview} />}
      </AnimatePresence>

      {/* System Modal */}
      <AnimatePresence>
        {activeSystem && <SystemModal system={activeSystem} onClose={() => setActiveSystem(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
