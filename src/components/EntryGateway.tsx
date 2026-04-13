import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EntryGateway = ({ onComplete }: { onComplete: () => void }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClick = () => {
    setIsTransitioning(true);
    // After animation sequence completes
    setTimeout(() => {
      onComplete();
    }, 2500); // 2.5s total sequence before releasing scroll & removing layer
  };

  // Generate random multiverse fragments
  const fragments = Array.from({ length: 45 }).map((_, i) => {
    const angle = (Math.random() * Math.PI * 2);
    const distance = 50 + Math.random() * 150; 
    const isText = Math.random() > 0.6;
    const texts = ["{ init }", "POST /sys", "200 OK", "sys.core", "AI_ACTIVE", "await render()"];
    
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: Math.random() * 0.4, // Tight cluster initially
      scale: Math.random() * 1.5 + 1,
      content: isText ? texts[Math.floor(Math.random() * texts.length)] : null,
      isNode: !isText && Math.random() > 0.5,
      isWire: !isText && Math.random() > 0.8,
    };
  });

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#010309] overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 1.2, delay: 1.3, ease: "easeInOut" }} // gateway fades out slowly revealing portfolio
      >
        {/* Deep Cosmic Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/5 to-[#010309] opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Ambient floating dust */}
        {!isTransitioning && Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full bg-primary/40 blur-[1px]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* MAIN BUTTON */}
        {!isTransitioning && (
          <motion.button
            onClick={handleClick}
            className="relative group cursor-pointer z-50 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
             {/* Deep Core Shadow */}
             <motion.div 
               className="absolute inset-0 rounded-full bg-primary/40 blur-3xl"
               animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             />

             {/* Dynamic Energy Rings */}
             <div className="absolute -inset-4 rounded-full border border-primary/20 scale-110 animate-[spin_8s_linear_infinite]" />
             <div className="absolute -inset-8 rounded-full border border-dashed border-primary/20 scale-125 animate-[spin_12s_linear_infinite_reverse]" />
             <div className="absolute -inset-12 rounded-full border-t border-r border-primary/10 scale-150 animate-[spin_20s_linear_infinite]" />

             {/* Lightning Border simulation */}
             <svg className="absolute inset-0 w-full h-full scale-[1.05] animate-[spin_6s_linear_infinite] opacity-60 overflow-visible pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="49" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="5 40 10 30 20 80" />
                <circle cx="50" cy="50" r="47" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="15 20 5 60" className="animate-[spin_3s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
             </svg>

             {/* Inner Button Container */}
             <div className="relative px-12 py-6 bg-[#0a0f1c]/90 backdrop-blur-xl rounded-full border border-primary/50 overflow-hidden shadow-[inset_0_0_30px_rgba(var(--primary),0.2)] group-hover:bg-primary/20 group-hover:border-primary transition-all duration-300">
                
                {/* Active Inner Glow */}
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Text */}
                <span className="relative z-10 font-mono text-sm md:text-base font-bold tracking-[0.25em] text-primary/90 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(var(--primary),0.8)] uppercase">
                  Enter the System
                </span>
             </div>
          </motion.button>
        )}

        {/* MULTIVERSE TRANSITION EFFECTS */}
        {isTransitioning && (
           <>
             {/* Massive Expanding Shockwave (Portal Edge) */}
             <motion.div
               className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-[2px] border-primary/90 shadow-[0_0_150px_80px_rgba(var(--primary),0.8)] z-40 bg-transparent"
               style={{ transform: 'translate(-50%, -50%)' }}
               initial={{ scale: 1, opacity: 1, borderWidth: "2px" }}
               animate={{ scale: 250, opacity: 0, borderWidth: "100px" }}
               transition={{ duration: 1.8, ease: "easeIn" }}
             />
             
             {/* Internal Light Flash */}
             <motion.div
               className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-white z-50 blur-xl"
               style={{ transform: 'translate(-50%, -50%)' }}
               initial={{ scale: 1, opacity: 1 }}
               animate={{ scale: 400, opacity: 0 }}
               transition={{ duration: 1.5, ease: "circIn" }}
             />

             {/* Flying Fragments (Hyperspace warp effect) */}
             {fragments.map(f => (
               <motion.div
                 key={f.id}
                 className="absolute top-1/2 left-1/2 z-40 flex items-center justify-center font-mono text-xs text-primary font-bold whitespace-nowrap"
                 style={{ transform: 'translate(-50%, -50%)' }}
                 initial={{ opacity: 0, scale: 0.1, x: 0, y: 0 }}
                 animate={{ 
                   opacity: [0, 1, 0],
                   scale: f.scale * 4, 
                   x: f.x * 12, 
                   y: f.y * 12 
                 }}
                 transition={{ 
                   duration: 1.0 + Math.random() * 0.5, 
                   ease: "easeIn",
                   delay: f.delay 
                 }}
               >
                 {f.content ? (
                   <span className="bg-[#010309]/80 px-2 py-1 rounded border border-primary/40 backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                     {f.content}
                   </span>
                 ) : f.isWire ? (
                    <div className="w-[100px] h-[2px] bg-primary/60 blur-[1px] rotate-45 shadow-[0_0_10px_rgba(var(--primary),1)]" />
                 ) : (
                   <div className={`w-10 h-10 border border-primary/50 bg-[#0a0f1c]/80 backdrop-blur shadow-[0_0_20px_rgba(var(--primary),0.6)] flex items-center justify-center ${f.isNode ? 'rounded-full' : 'rounded-lg'}`}>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                   </div>
                 )}
               </motion.div>
             ))}
           </>
        )}

      </motion.div>
    </AnimatePresence>
  );
};
