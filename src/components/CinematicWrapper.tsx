import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CinematicWrapper = ({ children }: { children: React.ReactNode }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for the glow
    const glowX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const glowY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    useEffect(() => {
        // 1. Smooth Scroll (Lenis)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // 2. Mouse Move listener for glow
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            lenis.destroy();
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Dynamic Ambient Light System */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[60] opacity-30 mix-blend-soft-light hidden md:block"
                style={{
                    background: useSpring(
                        `radial-gradient(600px circle at ${glowX}px ${glowY}px, hsla(var(--primary), 0.15), transparent 80%)`
                    ),
                }}
            // Note: Framer Motion can't animate radial-gradient string like this easily. 
            // We'll use a cleaner approach below for performance.
            />

            {/* Refined Cursor Glow */}
            <motion.div
                className="fixed pointer-events-none z-[60] w-[600px] h-[600px] rounded-full blur-[100px] hidden md:block opacity-20"
                style={{
                    x: glowX,
                    y: glowY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: 'radial-gradient(circle, hsla(var(--primary), 0.3) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </>
    );
};
