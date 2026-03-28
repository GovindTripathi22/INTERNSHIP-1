'use client';

import { motion } from 'framer-motion';
import { Target, Heart, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: "1. Play Your Round",
    desc: "Simply play your usual golf and enter your Stableford scores through our premium mobile interface.",
    color: "primary"
  },
  {
    icon: Heart,
    title: "2. Choose Your Impact",
    desc: "Select a featured charity and decide your contribution level. Your sub supports them directly.",
    color: "secondary"
  },
  {
    icon: TrendingUp,
    title: "3. Create Clarity",
    desc: "Our engine uses your scores to generate draw numbers. High scores increase prize pools and charity payouts.",
    color: "tertiary"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-surface-container-lowest/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-20 animate-entrance">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">The Engine of Change</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Three steps to transforming your passion into progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-8 border-t border-white/10 group-hover:scale-110 transition-transform">
                <step.icon className={`w-10 h-10 text-primary`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 italic uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
