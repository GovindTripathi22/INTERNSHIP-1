'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-40 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass rounded-[3xl] p-16 md:p-32 border-t border-white/10 max-w-6xl mx-auto shadow-2xl shadow-primary/5"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase italic leading-none tracking-tighter">
            Play with <span className="gradient-text">Clarity</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Join the collective of players who compete for more than just trophies. Every score entry is a step toward a better world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/signup">
              <Button size="lg" className="px-12 py-5 text-lg">Initialize Global Impact</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
