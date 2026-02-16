import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { label: "Total Projects", value: 45 },
    { label: "Automations Built", value: 120 },
    { label: "APIs Integrated", value: 85 },
    { label: "AI Systems Deployed", value: 12 },
];

const Counter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = value;
            const totalSteps = duration * 60;
            const increment = end / totalSteps;

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 1000 / 60);

            return () => clearInterval(timer);
        }
    }, [inView, value, duration]);

    return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
    return (
        <section className="py-20 bg-background">
            <div className="section-container">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title text-center mb-16"
                >
                    Developer Stats
                </motion.h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glow-card p-8 text-center flex flex-col items-center justify-center min-h-[160px]"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                <Counter value={stat.value} />
                                <span className="text-3xl ml-1">+</span>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
