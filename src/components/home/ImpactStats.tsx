'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Heart, Users, Trophy, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: 1240, label: 'Active Members', prefix: '', suffix: '+' },
  { icon: Heart, value: 28500, label: 'Raised for Charity', prefix: '£', suffix: '' },
  { icon: Trophy, value: 156, label: 'Prizes Awarded', prefix: '', suffix: '' },
  { icon: TrendingUp, value: 5, label: 'Charities Supported', prefix: '', suffix: '' },
];

export default function ImpactStats() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Real <span className="gradient-text">Impact</span>, Real Numbers
          </h2>
          <p className="text-slate-400">Every number represents a life touched, a cause supported.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center group hover:ring-1 hover:ring-violet-500/30 transition-all"
            >
              <stat.icon className="w-6 h-6 text-violet-400 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
