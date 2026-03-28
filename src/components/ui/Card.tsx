'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'obsidian' | 'glass';
  delay?: number;
}

export default function Card({ children, className, variant = 'obsidian', delay = 0 }: CardProps) {
  const variants = {
    obsidian: 'bg-surface-container/40 hover:bg-surface-container/60 transition-colors duration-500 border border-white/5',
    glass: 'glass glass-hover backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -5 }}
      className={cn(
        'rounded-3xl p-8 relative overflow-hidden group',
        variants[variant],
        className
      )}
    >
      {variant === 'glass' && (
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-700" />
      )}
      
      {/* Dynamic Ambient Glow on Hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
