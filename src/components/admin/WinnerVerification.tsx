'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Winner } from '@/types';

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
    <div className="space-y-4">
      {winners.map((w) => (
        <div key={w.id} className="glass rounded-xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <div className="font-semibold">{(w as any).users?.email || w.user_id}</div>
              <div className="text-xs text-slate-400">
                {w.match_tier}-match • {formatCurrency(w.prize_share)} • {formatDate(w.created_at)}
              </div>
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

          {w.proof_image_url ? (
            <div className="mb-3">
              <a
                href={w.proof_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
              >
                <ExternalLink className="w-3 h-3" />
                View Proof Image
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mb-3">No proof uploaded yet</p>
          )}

          {w.verification_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateStatus(w.id, 'approved')}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => updateStatus(w.id, 'rejected')}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
      {winners.length === 0 && (
        <p className="text-center text-slate-500 py-8">No winners to verify.</p>
      )}
    </div>
  );
}
