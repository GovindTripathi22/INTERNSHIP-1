import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'obsidian' | 'glass';
}

export default function Card({ children, className, variant = 'obsidian' }: CardProps) {
  const variants = {
    obsidian: 'bg-surface-container/50 hover:bg-surface-container transition-colors duration-300',
    glass: 'glass glass-hover',
  };

  return (
    <div className={cn(
      'rounded-2xl p-6 relative overflow-hidden',
      variants[variant],
      className
    )}>
      {variant === 'glass' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
      )}
      {children}
    </div>
  );
}
