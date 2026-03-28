'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CheckCircle2, XCircle, ExternalLink, Eye, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Winner } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function WinnerVerification({ winners: initial }: { winners: Winner[] }) {
  const [winners, setWinners] = useState(initial);
  const supabase = createClient();

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('winners').update({ verification_status: status }).eq('id', id);
    setWinners((prev) =>
      prev.map((w) => (w.id === id ? { ...w, verification_status: status } : w))
    );
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {winners.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`glass p-8 relative group overflow-hidden ${w.verification_status === 'pending' ? 'neon-glow' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-black italic border border-white/5">
                    {w.match_tier}
                 </div>
                 <div>
                    <div className="text-sm font-black uppercase tracking-widest text-white">{(w as any).users?.email || 'Anonymous Protocol'}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Match Tier {w.match_tier} Protocol</div>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                 <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prize Allocation</div>
                    <div className="text-xl font-black italic">{formatCurrency(w.prize_share)}</div>
                 </div>
                 <Badge
                    variant={
                      w.verification_status === 'approved'
                        ? 'success'
                        : w.verification_status === 'rejected'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {w.verification_status}
                  </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-8">
               <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Verification Artifact</div>
                  {w.proof_image_url ? (
                    <div className="relative h-32 rounded-2xl overflow-hidden glass group/img">
                      <img src={w.proof_image_url} alt="Proof" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                          <Eye className="w-8 h-8 text-primary" />
                       </div>
                       <a href={w.proof_image_url} target="_blank" className="absolute inset-0" />
                    </div>
                  ) : (
                    <div className="h-32 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center bg-surface-lowest text-slate-600">
                       <AlertTriangle className="w-6 h-6 mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for Upload</span>
                    </div>
                  )}
               </div>

               <div className="flex gap-4">
                  {w.verification_status === 'pending' && w.proof_image_url && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(w.id, 'approved')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 gap-2 font-black italic h-12"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateStatus(w.id, 'rejected')}
                        className="flex-1 gap-2 font-black italic h-12"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </>
                  )}
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {winners.length === 0 && (
        <div className="glass rounded-[2rem] p-24 text-center border-white/5">
           <p className="text-slate-600 font-bold uppercase tracking-[0.4em] italic text-sm">Clear Protocol Horizon: No Active Audits.</p>
        </div>
      )}
    </div>
  );
}
