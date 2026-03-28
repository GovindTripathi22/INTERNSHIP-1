'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Dices, Send, RotateCcw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { DrawSimulationResult } from '@/types';

export default function DrawSimulator() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [result, setResult] = useState<DrawSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const simulate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: `${month}-01` }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else alert(data.error);
    } catch (err) {
      alert('Simulation failed');
    }
    setLoading(false);
  };

  const publish = async () => {
    if (!result) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (res.ok) {
        alert('Draw published successfully!');
        setResult(null);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert('Publish failed');
    }
    setPublishing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-sm text-slate-400 block mb-1">Draw Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        <Button onClick={simulate} loading={loading}>
          <Dices className="w-4 h-4" />
          Simulate Draw
        </Button>
        {result && (
          <Button onClick={simulate} variant="secondary">
            <RotateCcw className="w-4 h-4" />
            Re-simulate
          </Button>
        )}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Winning Numbers */}
          <div className="glass rounded-xl p-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4">Winning Numbers</h4>
            <div className="flex gap-3">
              {result.draw.winning_numbers?.map((num, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-xl font-bold shadow-lg"
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pool Breakdown */}
          <div className="glass rounded-xl p-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4">Pool Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Total Revenue', value: result.pool_breakdown.total_revenue },
                { label: 'Charity Total', value: result.pool_breakdown.charity_total },
                { label: 'Prize Pool', value: result.pool_breakdown.prize_pool },
                { label: 'Rollover Out', value: result.pool_breakdown.rollover },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-lg p-3">
                  <div className="text-slate-400 text-xs">{item.label}</div>
                  <div className="font-bold mt-1">{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              {[
                { label: '5-Match Pool (40%)', value: result.pool_breakdown.tier5_pool },
                { label: '4-Match Pool (35%)', value: result.pool_breakdown.tier4_pool },
                { label: '3-Match Pool (25%)', value: result.pool_breakdown.tier3_pool },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 rounded-lg p-3">
                  <div className="text-slate-400 text-xs">{item.label}</div>
                  <div className="font-bold mt-1">{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Winners */}
          <div className="glass rounded-xl p-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4">
              Winners ({result.winners.length})
            </h4>
            {result.winners.length === 0 ? (
              <p className="text-sm text-slate-500">No winners this draw. Full pool rolls over.</p>
            ) : (
              <div className="space-y-2">
                {result.winners.map((w, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3 text-sm">
                    <div>
                      <span className="font-medium">{w.email}</span>
                      <span className="text-slate-400 ml-2">
                        Matched: [{w.matched_numbers.join(', ')}]
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-violet-400">{w.match_tier}-match</span>
                      <span className="font-bold text-amber-400">{formatCurrency(w.prize_share)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish */}
          <Button onClick={publish} loading={publishing} className="w-full" size="lg">
            <Send className="w-4 h-4" />
            Publish This Draw
          </Button>
        </motion.div>
      )}
    </div>
  );
}
