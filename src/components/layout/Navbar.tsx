'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Heart, Trophy, User } from 'lucide-react';
import Button from '@/components/ui/Button';

const navItems = [
  { name: 'Impact', path: '/charities', icon: Heart },
  { name: 'Pricing', path: '/subscribe', icon: Trophy },
  { name: 'The Engine', path: '/how-it-works', icon: Target },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <nav className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto glass rounded-full px-6 py-3 border-t border-white/10 shadow-lg shadow-primary/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
            <Target className="w-full h-full text-surface-lowest" />
          </div>
          <span className="font-display font-black text-xl tracking-tighter uppercase italic">
            Clarity<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group ${
                pathname === item.path ? 'text-primary' : 'text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <button className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2 transition-colors">
              Login
            </button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="primary" className="h-10 px-6">
              Oversight
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
