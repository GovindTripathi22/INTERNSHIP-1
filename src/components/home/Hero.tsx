'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-4">
      {/* Cinematic Environmental Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] opacity-40 blur-[150px] bg-gradient-radial from-primary/10 via-transparent to-transparent" 
        />
        <div className="absolute top-1/4 right-[5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Main Asymmetric Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="space-y-2">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 block mb-4"
              >
                The Professional Protocol
              </motion.span>
              <h1 className="text-7xl md:text-[10rem] font-black leading-[0.85] uppercase italic tracking-tighter m-0 p-0 text-white drop-shadow-2xl">
                Golf <br />
                <span className="text-transparent stroke-text">Clarity</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl border-l-2 border-primary/20 pl-8">
              The future of charitable sports. Every score generates an impact. 
              Join the technical revolution where elite performance meets global legacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link href="/subscribe">
                <Button size="lg" pulse>Begin Impact</Button>
              </Link>
              <Link href="/charities">
                <Button variant="secondary" size="lg">Explore Causes</Button>
              </Link>
            </div>
          </motion.div>

          {/* Impact Snapshot - Floating Glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-1 gap-6">
              <Card variant="glass" className="p-8 group hover:scale-[1.02] transition-transform duration-700">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Global Impact</div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                </div>
                <div className="text-5xl font-black italic tracking-tighter mb-2">
                  $<AnimatedCounter value={12450000} />+
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Protocol Winnings Generated</div>
              </Card>

              <div className="grid grid-cols-2 gap-6">
                 <Card variant="obsidian" className="p-6">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary mb-4">Active Players</div>
                    <div className="text-3xl font-black italic mb-1"><AnimatedCounter value={24500} />+</div>
                    <div className="w-full h-[2px] bg-secondary/20 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '70%' }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-secondary" 
                       />
                    </div>
                 </Card>
                 <Card variant="obsidian" className="p-6">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Causes Partnered</div>
                    <div className="text-3xl font-black italic mb-1"><AnimatedCounter value={142} /></div>
                    <div className="flex gap-1 mt-4">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 5 ? 'bg-primary' : 'bg-white/10'}`} />
                       ))}
                    </div>
                 </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px rgba(0, 255, 255, 0.5);
          text-shadow: 0 0 40px rgba(0, 255, 255, 0.2);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
