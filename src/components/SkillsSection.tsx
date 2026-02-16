import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React / Next.js', level: 90 },
      { name: 'JavaScript (ES6+)', level: 92 },
    ],
  },
  {
    title: 'Backend & Automation',
    skills: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'REST APIs & Webhooks', level: 90 },
      { name: 'n8n / Make.com', level: 95 },
    ],
  },
  {
    title: 'Data, AI & DevOps',
    skills: [
      { name: 'Airtable / Google Sheets', level: 90 },
      { name: 'Pinecone (Vector DB)', level: 85 },
      { name: 'Git / Cloud Hosting', level: 82 },
    ],
  },
];

const LiquidProgressBar = ({ skill, delay }: { skill: Skill; delay: number }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const start = 0;
      const end = skill.level;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const timer = setTimeout(() => {
        requestAnimationFrame(animate);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, skill.level, delay]);

  return (
    <div ref={ref} className="mb-8 group/bar">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-foreground tracking-tight group-hover/bar:text-primary transition-colors">
          {skill.name}
        </span>
        <span className="text-sm font-bold text-primary tabular-nums">
          {count}%
        </span>
      </div>
      <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden relative border border-white/5">
        {/* Fill Background - Liquid Glow */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'linear-gradient(90deg, hsl(186, 100%, 50%), hsl(174, 60%, 40%))',
            boxShadow: '0 0 15px hsl(186, 100%, 50%, 0.5)'
          }}
        >
          {/* Wave Motion Layer 1 */}
          <motion.div
            animate={{ x: [-20, 20], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          {/* Liquid Ripple Streak */}
          <motion.div
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute inset-0 w-1/4 bg-white/10 skew-x-[30deg] blur-sm pointer-events-none"
          />
        </motion.div>

        {/* Interaction Glow */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
};

const SkillCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // 3D Mouse Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const highlightX = useSpring(useTransform(mouseX, [-200, 200], [0, 100]), springConfig);
  const highlightY = useSpring(useTransform(mouseY, [-200, 200], [0, 100]), springConfig);

  const holographicBackground = useTransform(
    [highlightX, highlightY],
    ([hx, hy]) => `radial-gradient(circle at ${hx}% ${hy}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = event.clientX - rect.left;
    const mouseYVal = event.clientY - rect.top;

    x.set(mouseXVal / width - 0.5);
    y.set(mouseYVal / height - 0.5);
    mouseX.set(mouseXVal - width / 2);
    mouseY.set(mouseYVal - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el;
        inViewRef(el);
      }}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.14,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative group preserve-3d"
    >
      <div className="glow-card p-8 h-full bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden flex flex-col">

        {/* Holographic Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity z-20"
          style={{
            background: holographicBackground,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Interior Energy Drift */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary blur-[100px] rounded-full"
          />
        </div>

        <h3 className="text-xl font-bold mb-8 text-gradient relative z-10 tracking-tight">
          {category.title}
        </h3>

        <div className="flex-grow relative z-10">
          {category.skills.map((skill, skillIndex) => (
            <LiquidProgressBar
              key={skill.name}
              skill={skill}
              delay={0.1 * skillIndex}
            />
          ))}
        </div>

        {/* Bottom Bloom Glow */}
        <div
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="skills" className="relative py-28 overflow-hidden">
      {/* WebGL-like energy wave background highlight */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle mx-auto">
            Advanced toolsets and engineering methodologies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
