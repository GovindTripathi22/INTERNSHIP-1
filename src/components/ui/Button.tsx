'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  pulse?: boolean;
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  pulse = false,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-[#0e0e0e] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:brightness-110',
    secondary: 'bg-white/5 text-white hover:bg-white/10 ring-1 ring-white/10 backdrop-blur-sm',
    ghost: 'bg-transparent text-primary hover:bg-primary/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  };

  const sizes = {
    sm: 'px-6 py-2 text-[10px] uppercase font-black tracking-[0.2em]',
    md: 'px-8 py-3.5 text-xs uppercase font-black tracking-[0.2em]',
    lg: 'px-12 py-5 text-sm uppercase font-black tracking-[0.3em]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      animate={pulse ? {
        boxShadow: [
          '0 0 0px rgba(0,255,255,0)',
          '0 0 20px rgba(0,255,255,0.3)',
          '0 0 0px rgba(0,255,255,0)'
        ]
      } : {}}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      className={cn(
        'inline-flex items-center justify-center font-display rounded-full transition-all disabled:opacity-50 disabled:pointer-events-none italic',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-3 opacity-50" />
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
