'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight uppercase tracking-tighter italic">
            Golf <span className="gradient-text">Clarity</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            The future of charitable sports. Every score generates an impact. Every player creates a legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-entrance">
            <Link href="/subscribe">
              <Button size="lg">Begin Your Impact</Button>
            </Link>
            <Link href="/charities">
              <Button variant="secondary" size="lg">Explore Causes</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 border-t border-white/10">
              <div className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Total Impact</div>
              <div className="text-4xl font-black italic">
                $<AnimatedCounter value={12450000} />+
              </div>
            </div>
            <div className="glass rounded-2xl p-8 border-t border-white/10">
              <div className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Active Players</div>
              <div className="text-4xl font-black italic">
                <AnimatedCounter value={24500} />+
              </div>
            </div>
            <div className="glass rounded-2xl p-8 border-t border-white/10">
              <div className="text-sm font-bold uppercase tracking-widest text-tertiary mb-2">Charities Partnered</div>
              <div className="text-4xl font-black italic">
                <AnimatedCounter value={142} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
