'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Trophy, Upload, Image as ImageIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Winner } from '@/types';

export default function WinningsCard({ winners }: { winners: Winner[] }) {
  const [uploading, setUploading] = useState<string | null>(null);
  const supabase = createClient();

  const uploadProof = async (winnerId: string, file: File) => {
    setUploading(winnerId);
    const path = `proofs/${winnerId}/${file.name}`;
    const { data: upload } = await supabase.storage.from('winner-proofs').upload(path, file);

    if (upload) {
      const { data: { publicUrl } } = supabase.storage.from('winner-proofs').getPublicUrl(path);
      await supabase
        .from('winners')
        .update({ proof_image_url: publicUrl })
        .eq('id', winnerId);
    }
    setUploading(null);
  };

  if (winners.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Trophy className="w-10 h-10 text-slate-500 mx-auto mb-4" />
        <h3 className="font-bold mb-2">No Winnings Yet</h3>
        <p className="text-sm text-slate-400">Keep submitting scores — your winning draw could be next month!</p>
      </div>
    );
  }

  const verificationColors: Record<string, 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  };

  return (
    <div className="space-y-4">
      {winners.map((w) => (
        <div key={w.id} className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-semibold">{w.match_tier}-Number Match</div>
                <div className="text-xs text-slate-400">{formatDate(w.created_at)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-amber-400">{formatCurrency(w.prize_share)}</div>
              <Badge variant={verificationColors[w.verification_status]}>
                {w.verification_status}
              </Badge>
            </div>
          </div>

          {/* Proof upload */}
          {!w.proof_image_url ? (
            <label className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-violet-500/50 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Upload screenshot proof</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadProof(w.id, file);
                }}
              />
            </label>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <ImageIcon className="w-4 h-4" />
              <span>Proof uploaded</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
