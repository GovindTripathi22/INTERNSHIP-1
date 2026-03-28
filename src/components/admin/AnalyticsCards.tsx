'use client';

import { motion } from 'framer-motion';
import { Users, CreditCard, Heart, Trophy } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface AnalyticsData {
  totalUsers: number;
  activeSubscribers: number;
  totalPrizePool: number;
  totalCharityRaised: number;
}

export default function AnalyticsCards({ data }: { data: AnalyticsData }) {
  const cards = [
    { icon: Users, label: 'Total Users', value: data.totalUsers, color: 'from-violet-500 to-violet-600' },
    { icon: CreditCard, label: 'Active Subscribers', value: data.activeSubscribers, color: 'from-rose-500 to-rose-600' },
    { icon: Trophy, label: 'Prize Pool', value: data.totalPrizePool, prefix: '£', color: 'from-amber-500 to-amber-600' },
    { icon: Heart, label: 'Charity Raised', value: data.totalCharityRaised, prefix: '£', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl p-5"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
            <card.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={card.value} prefix={card.prefix || ''} />
          </div>
          <div className="text-xs text-slate-400 mt-1">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
