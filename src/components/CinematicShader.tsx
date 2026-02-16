import React from 'react';

const CinematicShader = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40 dark:opacity-20">
            {/* Soft Animated Light Wave */}
            <div className="absolute inset-0 shader-wave" />

            {/* Breathing Color Bloom */}
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,hsla(var(--primary),0.05),transparent_70%)] animate-pulse"
                style={{ animationDuration: '8s' }} />

            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>
    );
};

export default CinematicShader;
