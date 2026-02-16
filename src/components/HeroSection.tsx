import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TerminalIntro from './TerminalIntro';
import { Magnetic } from './Magnetic';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
      {/* Premium Background Highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container text-center relative z-10">

        {/* Greeting - subtle entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-base md:text-lg mb-4 tracking-wide font-light">
            Hello, I'm
          </p>
        </motion.div>

        {/* Name Animation */}
        {/* 
           - Float Up (40px -> 0)
           - Scale (0.92 -> 1)
           - Opacity (0 -> 1)
           - Duration 1.0s (was 1.2s)
           - Easing: cubic-bezier(.19,1,.22,1) (easeOutExpo-ish)
        */}
        <div className="relative inline-block mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.92, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 1.2,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight relative z-10"
          >
            <span className="text-primary inline-block">Abdul Rehman</span>
          </motion.h1>

        </div>

        {/* Role/Title Animation - Delayed */}
        {/* 
           - Starts 400ms after Name animation (1.0s + 0.4s = 1.4s delay)
           - Blur (10px -> 0)
           - Opacity (0 -> 1)
           - Slide Up (20px -> 0)
           - Neon Glow Pulse after visible
        */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: 1.4,
            ease: "easeOut"
          }}
          className="mb-8"
        >
          <motion.p
            className="text-xl md:text-2xl text-primary font-medium tracking-wide"
            transition={{
              duration: 0.8,
              delay: 1.4,
              ease: "easeOut"
            }}
          >
            {'{ Automation Engineer & Full-Stack Developer }'}
          </motion.p>
        </motion.div>

        {/* Description - further delayed */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }} // Cascading delay
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Automation Engineer and Full-Stack Developer building scalable automation
          systems and AI-driven workflows. Experienced in no-code platforms, API
          integrations, and modern web solutions for global clients.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Magnetic strength={0.2}>
            <Button asChild className="glow-button glow-primary px-8 py-6 text-base font-medium rounded-full">
              <a href="#contact">
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </a>
            </Button>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Button
              asChild
              variant="outline"
              className="glow-button glow-outline px-8 py-6 text-base font-medium rounded-full"
            >
              <a href="/Abdul-Rehman-CV.pdf" download="Abdul Rehman CV.pdf">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </a>
            </Button>
          </Magnetic>
        </motion.div>

        {/* Terminal Block */}
        <TerminalIntro />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors duration-300 p-2 block">
            <ChevronDown className="h-8 w-8 animate-bounce-slow opacity-70 hover:opacity-100" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
