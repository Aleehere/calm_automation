import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, MapPin } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

const experiences: Experience[] = [
  {
    title: 'Senior Automation & Integration Engineer',
    company: 'Rockwell Automation',
    location: 'US Company (Remote)',
    period: '2023 - Present',
    points: [
      'AI-driven lead generation systems',
      'Contract data extraction automation',
      'CRM workflows and email automation',
    ],
  },
  {
    title: 'AutomationBot Specialist',
    company: 'Standard Bots',
    location: 'US Company (Remote)',
    period: '2023 - 2024',
    points: [
      'AI Complaint & Feedback Classification System',
      'AI Commerce Assistant (Telegram + Shopify)',
      'Automated Lead Follow-Up System',
    ],
  },
  {
    title: 'Automation Analyst',
    company: 'DEVSINC',
    location: 'Pakistan',
    period: '2022 - 2023',
    points: [
      'n8n & Make.com workflow orchestration',
      'AI email and scheduling systems',
      'Airtable API automations',
    ],
  },
  {
    title: 'Team Lead – Private Label Department',
    company: 'Ecom Hawks',
    location: 'Lahore, Pakistan',
    period: '2021 - 2022',
    points: [
      'Led and managed a team of 7 VAs',
      'Optimized workflows and performance tracking',
    ],
  },
];

const TimelineItem = ({
  experience,
  index,
  isLast,
}: {
  experience: Experience;
  index: number;
  isLast: boolean;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-8 md:pl-12"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] md:left-[11px] top-6 w-0.5 h-full bg-border" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1 top-1.5">
        <div className="timeline-dot" />
      </div>

      <div className="glow-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{experience.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-primary">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{experience.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{experience.location}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
              {experience.period}
            </span>
          </div>
        </div>
        <ul className="space-y-2">
          {experience.points.map((point, pointIndex) => (
            <li key={pointIndex} className="flex items-start text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="experience" className="relative bg-card/30">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle mx-auto">
            My professional journey in automation and development
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((experience, index) => (
            <TimelineItem
              key={experience.company}
              experience={experience}
              index={index}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
