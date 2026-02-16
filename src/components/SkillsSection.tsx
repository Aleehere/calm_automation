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
      <div className="h-2.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 2, delay: delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-primary/40"
        >
          {/* Light Sweep Effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
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

  const holographicBackground = "transparent";

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
      animate={inView ? {
        opacity: 1,
        y: [0, -10, 0],
        scale: 1,
      } : {}}
      transition={{
        opacity: { duration: 0.8, delay: index * 0.14 },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.8, delay: index * 0.14 },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="relative group preserve-3d"
    >
      <div className="glow-card p-8 h-full bg-card/60 backdrop-blur-2xl border-border/40 relative overflow-hidden flex flex-col shadow-2xl">
        {/* Border Light Interpolation */}
        <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none z-20" />

        <h3 className="text-xl font-bold mb-8 text-foreground relative z-10 tracking-tight">
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
    <section id="skills" className="relative py-28 overflow-hidden bg-background">
      {/* Clean background */}

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
