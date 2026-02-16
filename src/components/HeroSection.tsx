import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
      {/* Background Effect - keep it subtle to not distract */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-40 z-0 pointer-events-none" />

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
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.0,
              ease: [0.19, 1, 0.22, 1], // Premium feel easing
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight relative z-10"
          >
            <span className="text-gradient inline-block">Abdul Rehman</span>
          </motion.h1>

          {/* Shine/Glow Sweep Effect */}
          {/* Sweeps across after the main text settles (delay 1.0s) */}
          <motion.div
            initial={{ left: "-100%", opacity: 0 }}
            animate={{ left: "200%", opacity: 1 }} // Move way past to ensure full clear
            transition={{
              delay: 1.0,
              duration: 1.2,
              ease: "easeInOut",
              repeat: 0,
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-20 mix-blend-overlay"
            style={{ filter: "blur(5px)" }}
          />
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
            animate={{
              textShadow: [
                "0 0 10px rgba(6,182,212,0.2)",
                "0 0 20px rgba(6,182,212,0.4)",
                "0 0 10px rgba(6,182,212,0.2)"
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.2 // Start pulsing sooner
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
          <Button asChild className="glow-button px-8 py-6 text-base font-medium rounded-full">
            <a href="#contact">
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </a>
          </Button>

          <Button
            variant="outline"
            className="px-8 py-6 text-base font-medium rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
        </motion.div>

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
