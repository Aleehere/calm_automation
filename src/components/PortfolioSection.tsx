import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Bot, Mail, Users, FileText, MessageSquare, X, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  icon: React.ReactNode;
  screenshot: string;
}

const projects: Project[] = [
  {
    title: 'Unfulfilled Order Monitoring Automation',
    description:
      'Built an n8n workflow to monitor Shopify orders every 3 hours and automatically flag unfulfilled orders older than 72 hours into Monday.com for operations tracking.',
    tech: ['n8n', 'Shopify', 'Monday.com'],
    icon: <FileText className="h-6 w-6" />,
    screenshot: '/unfulfilled-automation.png',
  },
  {
    title: 'AI Email & Meeting Automation',
    description:
      'AI-driven system to analyze inbound emails, maintain context memory, check availability, book meetings, and send automated responses.',
    tech: ['n8n', 'AI Agents', 'Email APIs'],
    icon: <Mail className="h-6 w-6" />,
    screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Airtable API Workflow Orchestration',
    description: 'Designed a Make.com automation using routers and iterators to sync, branch, and process Airtable records across multiple workflows.',
    tech: ['Make.com', 'Airtable', 'HTTP APIs'],
    icon: <FileText className="h-6 w-6" />,
    screenshot: '/airtable-workflow.png',
  },
  {
    title: 'AI-Driven Lead Generation Pipeline',
    description:
      'Automated lead enrichment and qualification using Google Forms, Apollo, Apify, OpenAI, and Google Sheets.',
    tech: ['Make.com', 'OpenAI', 'Apify'],
    icon: <Users className="h-6 w-6" />,
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Contract Royalty Extraction Automation',
    description:
      'Extracted structured royalty data from contracts and generated Excel reports automatically.',
    tech: ['n8n', 'AI Parsing', 'Excel'],
    icon: <FileText className="h-6 w-6" />,
    screenshot: '/contract-royalty.png',
  },
  {
    title: 'AI Complaint Classification System',
    description: 'Built an n8n workflow using AI Agents to analyze form submissions, classify complaints/features, create records, and notify teams.',
    tech: ['n8n', 'AI Agents', 'Slack'],
    icon: <Bot className="h-6 w-6" />,
    screenshot: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'AI Commerce Assistant (Telegram + Shopify)',
    description: 'Built a conversational AI commerce assistant that handles product queries and order flow via Telegram integrated with Shopify.',
    tech: ['AI Agents', 'Telegram', 'Shopify'],
    icon: <MessageSquare className="h-6 w-6" />,
    screenshot: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Automated Lead Follow-Up System',
    description: 'Built an automated follow-up engine that triggers personalized responses based on CRM activity and engagement tracking.',
    tech: ['Make.com', 'CRM', 'Automation'],
    icon: <Mail className="h-6 w-6" />,
    screenshot: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
  },
];

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const previewX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const previewY = useTransform(mouseY, [-0.5, 0.5], [-50, -30]);

  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative" ref={ref}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          ease: [0.23, 1, 0.32, 1]
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="glow-card group cursor-pointer relative z-10"
      >
        <div className="p-6 relative overflow-hidden" style={{ transform: "translateZ(20px)" }}>
          {/* Minimal Interaction Layer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-300 bg-primary" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              {project.icon}
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-12" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-gradient transition-all">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-md bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interactive Screenshot Preview */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: -40 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              x: previewX,
              y: previewY,
            }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full z-50 pointer-events-none"
          >
            <div className="w-[280px] rounded-xl overflow-hidden border border-primary/40 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-card/90 backdrop-blur-md">
              <img
                src={project.screenshot}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-white/90 line-clamp-1">
                {project.title}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr,0.8fr] h-full overflow-hidden">
          {/* Main Visual - Larger and more prominent */}
          <div className="relative h-[250px] md:h-[400px] lg:h-full bg-black/20 overflow-hidden group">
            <img
              src={project.screenshot}
              alt={project.title}
              className="w-full h-full object-contain bg-[#0a0a0a] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            {/* "Full Pic" Hint */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Detailed Workflow View</span>
            </div>
          </div>

          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center bg-card overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-primary/20">
              {project.icon}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gradient leading-tight">{project.title}</h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg mb-8 leading-relaxed max-w-prose">
              {project.description}
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold text-foreground/50 uppercase tracking-[0.2em] mb-4">Architecture & Tools</h4>
                <div className="flex flex-wrap gap-2.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20 tracking-wide hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glow-button inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-lg shadow-primary/20"
                >
                  View Detailed Specs <ExternalLink className="h-4 w-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-muted/50 text-foreground font-bold text-sm tracking-wide border border-border hover:bg-muted transition-all"
                >
                  Request Case Study
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PortfolioSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="relative py-20 overflow-hidden bg-background">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Portfolio Showcase</h2>
          <p className="section-subtitle mx-auto">
            Transforming complex logic into seamless digital experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}} />
    </section>
  );
};

export default PortfolioSection;
