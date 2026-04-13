import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from './Magnetic';
import WorkflowAnimation from './WorkflowAnimation';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden pt-32 pb-20 px-6 lg:px-12">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl w-full z-10 mx-auto">
        {/* Balanced 50/50 two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Column ── */}
          <div className="text-left relative z-10 flex flex-col gap-8 justify-center">

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative inline-block w-fit"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-0.5 bg-border/30 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border border-primary/20 relative bg-background/80 backdrop-blur-sm">
                  <img
                    src="/abr-image.png"
                    alt="Abdul Rehman"
                    className="w-full h-full object-cover object-top contrast-[1.02] hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10 opacity-50" />
            </motion.div>

            {/* Text Block */}
            <div className="flex flex-col gap-5">
              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="text-primary/60 font-semibold tracking-[0.5em] uppercase text-[10px] md:text-xs"
              >
                Hello, I'm
              </motion.p>

              {/* Name — slightly smaller so it stays on one clean line */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
              >
                <span className="text-gradient">Abdul Rehman</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.65, ease: "easeOut" }}
              >
                <p className="text-lg md:text-xl text-foreground/80 font-light tracking-wide border-l-2 border-primary/20 pl-5">
                  {'{ Automation Engineer & Full-Stack Developer }'}
                </p>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed font-light"
            >
              I build intelligent systems that think, connect, and automate — combining AI, APIs, and full-stack development into living workflows that scale.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="flex flex-row items-center gap-4 flex-wrap"
            >
              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="glow-button glow-primary px-8 py-6 text-sm rounded-full transition-all duration-500">
                  <a href="#contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Get In Touch
                  </a>
                </Button>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="glow-button glow-outline px-8 py-6 text-sm rounded-full transition-all duration-500"
                >
                  <a href="/Abdul-Rehman-CV.pdf" download="Abdul Rehman CV.pdf">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          {/* ── Right Column — Workflow Visual ── */}
          <div
            className="relative w-full flex items-center justify-end opacity-95"
            style={{ height: 'clamp(440px, 56vh, 600px)' }}
          >
            <div className="absolute inset-0 bg-primary/[0.02] rounded-3xl blur-[90px] pointer-events-none" />
            <WorkflowAnimation />
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <a href="#about" className="text-muted-foreground hover:text-primary transition-all duration-300 p-2 block group">
            <ChevronDown className="h-7 w-7 animate-bounce-slow opacity-20 group-hover:opacity-100 transition-all" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
