import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300 focus:outline-none"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5 overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "light" ? 0 : -25,
                        opacity: theme === "light" ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun className="h-5 w-5 text-amber-500" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        y: theme === "dark" ? 0 : 25,
                        opacity: theme === "dark" ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Moon className="h-5 w-5 text-blue-400" />
                </motion.div>
            </div>
        </button>
    );
}
