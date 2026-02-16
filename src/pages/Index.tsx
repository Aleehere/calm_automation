import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import PortfolioSection from '@/components/PortfolioSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StatsSection from '@/components/StatsSection';
import { motion } from 'framer-motion';
import CinematicShader from '@/components/CinematicShader';

const sectionVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
  }
};

const SectionWrapper = ({ children, id }: { children: React.ReactNode, id: string }) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-10%" }}
    variants={sectionVariants}
    className="relative"
  >
    {children}
  </motion.section>
);

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticleBackground />
      <CinematicShader />
      <Navbar />
      <main className="relative z-10">
        <SectionWrapper id="home"><HeroSection /></SectionWrapper>
        <SectionWrapper id="stats"><StatsSection /></SectionWrapper>
        <SectionWrapper id="about"><AboutSection /></SectionWrapper>
        <SectionWrapper id="skills"><SkillsSection /></SectionWrapper>
        <SectionWrapper id="portfolio"><PortfolioSection /></SectionWrapper>
        <SectionWrapper id="experience"><ExperienceSection /></SectionWrapper>
        <SectionWrapper id="contact"><ContactSection /></SectionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
