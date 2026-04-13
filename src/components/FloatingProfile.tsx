import { motion } from 'framer-motion';
import { Magnetic } from './Magnetic';

const FloatingProfile = () => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      initial={{ opacity: 0, x: 40, y: window.innerHeight - 140 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      style={{ left: 24, bottom: 24 }}
    >
      <Magnetic strength={0.2}>
        <div className="relative group">
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500" />
          
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 overflow-hidden bg-card/80 backdrop-blur-xl p-1 shadow-2xl transition-all duration-500 hover:border-primary/60 scale-100 hover:scale-105 active:scale-95">
            <img
              src="/abr-image.png"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          {/* "Adjustable" Tooltip - Fades in on Hover */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-card/90 backdrop-blur-md rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Adjust Me
          </div>
        </div>
      </Magnetic>
    </motion.div>
  );
};

export default FloatingProfile;
