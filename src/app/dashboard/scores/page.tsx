'use client';

import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Target, List, History, PlusCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreManagement() {
  const [scores, setScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('scores').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        setScores(data || []);
      }
      setIsLoading(false);
    }
    loadScores();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Score Protocol</h2>
          <p className="text-slate-500">Only the latest 5 verified entries are factored into the Draw Engine.</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" /> New Verification
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scores.map((score, i) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card variant="glass" className="flex items-center justify-between p-6">
              <div className="flex items-center gap-8">
                <div className="text-5xl font-black italic text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  {score.score}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Sync Status</div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Timestamp</div>
                  <div className="text-sm font-medium">{formatDate(score.played_date)}</div>
                </div>
              </div>
              <div className="text-right">
                <Button variant="ghost" size="sm" className="opacity-40 hover:opacity-100">Details</Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {scores.length >= 5 && (
          <div className="glass border-primary/20 bg-primary/5 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Queue Optimized</div>
              <p className="text-xs text-slate-400">Your performance queue is currently limited to 5 high-impact entries. Subsequent entries will replace the oldest verification.</p>
            </div>
          </div>
        )}

        {!isLoading && scores.length === 0 && (
          <div className="glass rounded-[2rem] p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-surface-container flex items-center justify-center rounded-3xl mx-auto">
              <History className="w-10 h-10 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase italic mb-2">No Protocols Detected</h3>
              <p className="text-slate-500">You must initialize your athletic record to generate impact.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
