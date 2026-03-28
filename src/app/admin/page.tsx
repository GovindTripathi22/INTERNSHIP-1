'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { BarChart3, TrendingUp, Heart, Users, Activity, Terminal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      
      const [userCount, activeSubs, draws] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('draws').select('total_pool, charity_total').eq('status', 'published')
      ]);

      const totalPrizePool = (draws.data || []).reduce((acc: number, d: any) => acc + d.total_pool, 0);
      const totalCharityRaised = (draws.data || []).reduce((acc: number, d: any) => acc + d.charity_total, 0);

      setData({
        totalUsers: userCount.count || 0,
        activeSubscribers: activeSubs.count || 0,
        totalPrizePool,
        totalCharityRaised,
      });
      setIsLoading(false);
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="danger" className="animate-pulse">Live Link</Badge>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Protocol Admin-01</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">
            System <span className="gradient-text">Oversight</span>
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time platform metrics and global distribution data.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" size="sm" className="gap-2 border border-white/5 uppercase">
            <Terminal className="w-4 h-4" /> Draw Simulator
          </Button>
        </div>
      </div>

      {/* Technical Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Nodes', value: data.totalUsers, icon: Users, color: 'primary' },
          { label: 'Active Subs', value: data.activeSubscribers, icon: Activity, color: 'secondary' },
          { label: 'Impact Payout', value: formatCurrency(data.totalCharityRaised), icon: Heart, color: 'rose-400' },
          { label: 'Prize Engine', value: formatCurrency(data.totalPrizePool), icon: TrendingUp, color: 'emerald-400' }
        ].map((stat, i) => (
          <Card key={i} variant="glass" className="group">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 rounded-xl bg-surface-container-high border border-white/5 transition-transform group-hover:scale-110">
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <Activity className="w-4 h-4 text-slate-700 animate-pulse" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{stat.label}</div>
            <div className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap">
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card variant="glass" className="h-[400px] flex flex-col justify-center items-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                <Badge variant="info">Protocol Stable</Badge>
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest leading-none">Visualization v.2.4.1</div>
             </div>
             <div className="text-center space-y-4">
               <BarChart3 className="w-12 h-12 text-primary opacity-20 mx-auto" />
               <p className="text-slate-600 text-sm font-medium uppercase tracking-[0.2em]">Synthesizing Impact Timeline...</p>
             </div>
             {/* Abstract Lines */}
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black italic uppercase tracking-[0.3em] text-slate-500">Security Protocols</h3>
          <Card variant="obsidian" className="space-y-6 p-8 border border-white/5">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-primary rounded-full" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">Algorithmic Draw</div>
                  <p className="text-xs text-slate-500 leading-relaxed">System using 128-bit seeding for monthly prize distribution.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 opacity-50">
                <div className="w-1 h-12 bg-secondary rounded-full" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">Score Verification</div>
                  <p className="text-xs text-slate-500 leading-relaxed">Multi-point validation for Stableford entry authenticity.</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase">RLS Security Status</span>
                <Badge variant="success">Active</Badge>
              </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
