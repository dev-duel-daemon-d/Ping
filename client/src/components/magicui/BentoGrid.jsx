import { ArrowRightIcon } from "lucide-react";
import { cn } from "../../lib/utils"; // Adjust path as needed
import { motion } from "framer-motion";

const BentoGrid = ({ children, className }) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[32rem] grid-cols-3 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
            // Light mode styles
            "bg-white/10 [box-shadow:0_0_0_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]",
            // Dark mode styles
            "bg-black/40 border border-white/10", // Added border and adjust bg for better contrast
            className
        )}
    >
        <div className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105 opacity-50">
            {background}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/100" />

        <div className="pointer-events-none z-20 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 group-hover:scale-95 place-content-end h-full">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm mb-2 border border-yellow-500/30">
                <Icon className="h-8 w-8 origin-left transform-gpu text-yellow-400 transition-all duration-300 ease-in-out group-hover:scale-75" />
            </div>

            <h3 className="text-2xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-300 group-hover:text-neutral-200">{description}</p>
        </div>

        <div
            className={cn(
                "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20"
            )}
        >
            <button className="pointer-events-auto flex items-center gap-2 rounded-full bg-yellow-500/90 hover:bg-yellow-400 px-4 py-2 text-sm font-bold text-black backdrop-blur-sm transition-all shadow-lg shadow-yellow-500/20">
                {cta}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
        </div>
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </motion.div>
);

export { BentoGrid, BentoCard };
