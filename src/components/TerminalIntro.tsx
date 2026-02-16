import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TerminalIntro = () => {
    const [text, setText] = useState("");
    const fullText = "npm run build-future\nSystem initialized...\nAutomation Engine Ready";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="max-w-2xl mx-auto mt-12 overflow-hidden rounded-lg border border-border bg-card shadow-2xl font-mono text-sm group"
        >
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-2 text-muted-foreground text-xs">zsh — 80x24</span>
            </div>
            <div className="p-6 text-left whitespace-pre-wrap leading-relaxed">
                <span className="text-primary mr-2">➜</span>
                <span className="text-foreground">{text}</span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                />
            </div>
        </motion.div>
    );
};

export default TerminalIntro;
