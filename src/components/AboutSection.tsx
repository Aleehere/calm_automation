import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useRef } from 'react';
import { Camera, Zap, Network, Brain, Globe, Code2, Layers, Cpu, Wrench, Database } from 'lucide-react';

const techIcons = [
  { name: 'n8n', icon: <Zap className="w-5 h-5 text-[#ff6d5a]" />, color: '#ff6d5a' },
  { name: 'Make.com', icon: <Network className="w-5 h-5 text-[#7a29ff]" />, color: '#7a29ff' },
  { name: 'AI Agents', icon: <Brain className="w-5 h-5 text-[#9d4edd]" />, color: '#9d4edd' },
  { name: 'API Integrations', icon: <Globe className="w-5 h-5 text-[#4cc9f0]" />, color: '#4cc9f0' },
  { name: 'React', icon: <Code2 className="w-5 h-5 text-[#61dafb]" />, color: '#61dafb' },
  { name: 'Next.js', icon: <Layers className="w-5 h-5 text-white" />, color: '#ffffff' },
  { name: 'Node.js', icon: <Cpu className="w-5 h-5 text-[#339933]" />, color: '#339933' },
  { name: 'Airtable', icon: <Wrench className="w-5 h-5 text-[#18bfff]" />, color: '#18bfff' },
  { name: 'Pinecone', icon: <Database className="w-5 h-5 text-[#00d084]" />, color: '#00d084' },
];

const AboutSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="section-container relative z-10" ref={ref}>

        {/* Heading & Subheading - Exactly Same as Reference */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle mx-auto">Get to know who I am and what I do</p>
        </motion.div>

        {/* Layout Grid - Exactly Same Proportion */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Center-aligned content hub */}
          <div className="flex flex-col items-center">

            {/* Profile Circle - TOP CENTER of this area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative mb-12"
            >
              {/* Outer Glow Ring & Breathing Bloom */}
              <motion.div
                className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-primary/20 relative z-10 overflow-hidden bg-card p-1 shadow-2xl"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                  <motion.img
                    src="/abr-image.png"
                    alt="Profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Introduction Panel - Below Profile Circle */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }} // Exactly 600ms delay
              className="glow-card p-8 md:p-10 w-full max-w-2xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-foreground text-center lg:text-left">
                Hi, I'm an <span className="text-gradient">Automation Engineer</span> & Full-Stack Developer
              </h3>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-center lg:text-left">
                <p>
                  I build production-ready automation systems and AI workflows that reduce manual work and scale operations.
                  My experience spans workflow orchestration, API integrations, AI agents, and modern full-stack development.
                </p>
                <p>
                  I focus on clean logic, reliable systems, and real-world business outcomes.
                </p>
              </div>

              {/* Competencies Chips - Original Styling */}
              <div className="mt-10">
                <h4 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest inline-block border-b border-primary/20 pb-1">
                  Core Competencies
                </h4>
                <div className="flex flex-wrap gap-2 pt-2">
                  {techIcons.map((tech) => (
                    <span key={tech.name} className="chip text-xs">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Animated Orbiting Tech Visualization */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Visual Orbit Rings */}
            <div className="absolute w-[300px] h-[300px] border border-primary/10 rounded-full opacity-50" />
            <div className="absolute w-[450px] h-[250px] border border-primary/5 rounded-full rotate-45 opacity-30" />

            <div className="relative w-full h-full">
              {techIcons.map((tech, index) => {
                const angle = (index / techIcons.length) * Math.PI * 2;
                const radiusX = 180 + (index % 3) * 20;
                const radiusY = 140 + (index % 2) * 30;
                const duration = 25 - (index % 5) * 2;

                return (
                  <motion.div
                    key={tech.name}
                    animate={inView ? {
                      x: [
                        Math.cos(angle) * radiusX,
                        Math.cos(angle + (Math.PI / 2)) * radiusX * 0.8,
                        Math.cos(angle + Math.PI) * radiusX,
                        Math.cos(angle + (3 * Math.PI / 2)) * radiusX * 0.8,
                        Math.cos(angle + Math.PI * 2) * radiusX
                      ],
                      y: [
                        Math.sin(angle) * radiusY,
                        Math.sin(angle + (Math.PI / 2)) * radiusY * 1.2,
                        Math.sin(angle + Math.PI) * radiusY,
                        Math.sin(angle + (3 * Math.PI / 2)) * radiusY * 1.2,
                        Math.sin(angle + Math.PI * 2) * radiusY
                      ]
                    } : {}}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, filter: "brightness(1.5)" }}
                      className="group relative cursor-pointer"
                    >
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all shadow-lg"
                        style={{
                          boxShadow: `0 0 15px ${tech.color}22`,
                          borderLeft: `2px solid ${tech.color}44`
                        }}
                      >
                        {tech.icon}

                        {/* Interactive Tooltip */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/90 rounded text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-50">
                          {tech.name}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Hub Pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>

        </div>
      </div>
    </section >
  );
};

export default AboutSection;
