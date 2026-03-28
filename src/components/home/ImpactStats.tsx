'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Heart, Users, Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';

const stats = [
  { icon: Users, value: 124500, label: 'Active Network', prefix: '', suffix: '+', color: 'primary' },
  { icon: Heart, value: 28500000, label: 'Capital Transferred', prefix: '$', suffix: '', color: 'secondary' },
  { icon: Trophy, value: 4500, label: 'Claims Verified', prefix: '', suffix: '+', color: 'primary' },
  { icon: Target, value: 156, label: 'Global Charities', prefix: '', suffix: '', color: 'secondary' },
];

export default function ImpactStats() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Local Ambient Flare */}
      <div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6">Real-Time Oversight</div>
            <h2 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] uppercase italic tracking-tighter">
              Performance <br />
              <span className="text-white/20">Generated</span> <span className="gradient-text">Impact</span>.
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="lg:col-span-4 pb-4"
          >
            <p className="text-slate-400 font-medium leading-relaxed border-l border-white/10 pl-8">
              Every score submitted through the Clarity Protocol fuels our global network of verified charities. 
              We don't just play; we optimize the future of giving.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <Card 
              key={stat.label} 
              variant="glass" 
              delay={i * 0.1}
              className="text-left group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={stat.color === 'primary' ? 'text-primary' : 'text-secondary'}>
                  <stat.icon className="w-8 h-8 stroke-[1.5px]" />
                </div>
                <Zap className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-black italic tracking-tighter">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>

              {/* Technical Meter Component */}
              <div className="mt-8 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: i * 0.2 + 0.5 }}
                  className={`h-full ${stat.color === 'primary' ? 'bg-primary' : 'bg-secondary'} opacity-50`} 
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
