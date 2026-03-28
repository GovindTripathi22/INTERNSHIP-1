'use client';

import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Target, Heart, Trophy, TrendingUp, ArrowUpRight, Plus, Eye, History } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [winnings, setWinnings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const [userData, scoreData, subData, winData] = await Promise.all([
          supabase.from('users').select('*, charities(*)').eq('id', authUser.id).single(),
          supabase.from('scores').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('subscriptions').select('*').eq('user_id', authUser.id).single(),
          supabase.from('winners').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false })
        ]);

        setUser(userData.data);
        setScores(scoreData.data || []);
        setSubscription(subData.data);
        setWinnings(winData.data || []);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const totalWinnings = winnings?.reduce((acc, w) => acc + w.prize_share, 0) || 0;
  const recentScoreValue = scores?.[0]?.score || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="primary" className="mb-4">Oversight Active</Badge>
          <h1 className="text-5xl font-black italic uppercase italic leading-none tracking-tighter mb-2">
            Control Center<span className="text-primary">.</span>
          </h1>
          <p className="text-slate-500 font-medium">Monitoring charitable impact and athletic performance.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/scores">
            <Button size="sm" variant="secondary" className="gap-2">
              <Plus className="w-4 h-4" /> Entry
            </Button>
          </Link>
          <Link href="/dashboard/winnings">
            <Button size="sm" variant="ghost" className="gap-2 border border-primary/20">
              <Trophy className="w-4 h-4" /> Payouts
            </Button>
          </Link>
        </div>
      </div>

      {/* High-Impact Stat Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:neon-glow transition-all">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Recent Score</div>
          <div className="text-4xl font-black italic tracking-tighter">
            <AnimatedCounter value={recentScoreValue} />
          </div>
        </Card>

        <Card variant="glass" className="group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:neon-glow transition-all">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Selected Cause</div>
          <div className="text-xl font-bold truncate italic uppercase tracking-tight">
            {user?.charities?.name || 'INITIALIZING...'}
          </div>
        </Card>

        <Card variant="glass" className="group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:neon-glow transition-all">
              <Trophy className="w-6 h-6 text-tertiary" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Impact Pool</div>
          <div className="text-4xl font-black italic tracking-tighter">
            $<AnimatedCounter value={totalWinnings} />
          </div>
        </Card>

        <Card variant="glass" className="group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center group-hover:neon-glow transition-all">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <Badge variant={subscription?.status === 'active' ? 'success' : 'danger'}>
              {subscription?.status || 'PENDING'}
            </Badge>
          </div>
          <div className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Status Protocol</div>
          <div className="text-xl font-bold italic uppercase tracking-tight">
            {subscription?.plan_type || 'NONE'}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Technical Score Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black italic uppercase tracking-widest flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Score Protocol Feed
            </h3>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">LATEST 5 SYNCED</span>
          </div>
          
          <div className="space-y-4">
            {scores.map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 flex items-center justify-between group hover:bg-surface-container-high transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-xl font-black italic border border-white/5">
                    {s.score}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">Verification Date</div>
                    <div className="text-sm font-medium text-slate-300">{formatDate(s.played_date)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="primary" className="opacity-40 group-hover:opacity-100 transition-opacity">STABLEFORD</Badge>
                  <Eye className="w-4 h-4 text-slate-600 hover:text-primary cursor-pointer" />
                </div>
              </motion.div>
            ))}
            {scores.length === 0 && (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-slate-500 font-medium">No score protocols detected on this account.</p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Configuration */}
        <div className="space-y-6">
          <h3 className="text-lg font-black italic uppercase tracking-widest flex items-center gap-2">
            <Heart className="w-5 h-5 text-secondary" />
            Impact Configuration
          </h3>
          <Card variant="glass" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="text-center py-10 relative z-10">
              <div className="text-5xl font-black italic gradient-text mb-2 tracking-tighter">
                {user?.charity_contribution_pct || 10}%
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black mb-8">
                Distribution Ratio
              </div>
              
              <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user?.charity_contribution_pct || 10}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Your performance protocol is currently linked to <span className="text-white font-bold italic uppercase">{user?.charities?.name}</span>.
              </p>

              <Button variant="secondary" className="w-full">Modify Ratio</Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
