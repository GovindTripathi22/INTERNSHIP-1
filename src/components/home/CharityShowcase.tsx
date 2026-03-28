'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Heart, School, Droplets, Leaf } from 'lucide-react';

const featuredCharities = [
  {
    name: "Green Horizons",
    desc: "Protecting biodiversity through community-led reforestation projects.",
    impact: "$1.2M Raised",
    icon: Leaf,
    color: "primary"
  },
  {
    name: "Water Fore All",
    desc: "Providing sustainable clean water solutions for remote communities.",
    impact: "12k Filters",
    icon: Droplets,
    color: "secondary"
  },
  {
    name: "Junior Masters Found.",
    desc: "Empowering underprivileged youth through sports education and mentorship.",
    impact: "142 Schools",
    icon: School,
    color: "tertiary"
  }
];

export default function CharityShowcase() {
  return (
    <section className="py-32 relative">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 animate-entrance">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-4 italic uppercase">Visionary Giving</h2>
            <p className="text-slate-500">We partner with global organizations that turn your play into life-changing progress.</p>
          </div>
          <div className="text-primary font-display font-bold uppercase tracking-widest border-b border-primary/20 pb-2">
            View All Partners
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCharities.map((charity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="h-full group">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6 ring-1 ring-white/5 group-hover:neon-glow transition-all">
                  <charity.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 italic uppercase">{charity.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">{charity.desc}</p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Core Impact</span>
                  <Badge variant="info" className="bg-primary/10 text-primary border-primary/20">
                    {charity.impact}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
