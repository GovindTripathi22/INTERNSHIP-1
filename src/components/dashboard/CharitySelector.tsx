'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import type { Charity } from '@/types';

export default function CharitySelector({
  charities,
  selectedId,
  contributionPct,
  userId,
}: {
  charities: Charity[];
  selectedId: string | null;
  contributionPct: number;
  userId: string;
}) {
  const [selected, setSelected] = useState(selectedId);
  const [pct, setPct] = useState(contributionPct);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const save = async () => {
    setSaving(true);
    await supabase
      .from('users')
      .update({ selected_charity_id: selected, charity_contribution_pct: pct })
      .eq('id', userId);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-600/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="font-semibold">Choose Your Charity</h3>
          <p className="text-xs text-slate-400">Select which cause receives your contribution.</p>
        </div>
      </div>

      {/* Contribution slider */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">Contribution: <span className="font-bold text-amber-400">{pct}%</span></span>
          <span className="text-xs text-slate-400">Minimum 10%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={pct}
          onChange={(e) => setPct(parseInt(e.target.value))}
          className="w-full accent-violet-500"
        />
      </div>

      {/* Charity grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {charities.map((charity) => (
          <motion.button
            key={charity.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(charity.id)}
            className={`glass rounded-xl p-4 text-left transition-all ${
              selected === charity.id
                ? 'ring-2 ring-violet-500 bg-violet-600/10'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm mb-1">{charity.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{charity.description}</p>
              </div>
              {selected === charity.id && (
                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <Button onClick={save} loading={saving} className="w-full">
        Save Charity Preference
      </Button>
    </div>
  );
}
