'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2 } from 'lucide-react';
import type { Score } from '@/types';

export default function ScoreEntry({
  scores: initialScores,
  userId,
}: {
  scores: Score[];
  userId: string;
}) {
  const [scores, setScores] = useState(initialScores);
  const [newScore, setNewScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const addScore = async () => {
    const val = parseInt(newScore);
    if (isNaN(val) || val < 1 || val > 45) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('scores')
      .insert({ user_id: userId, score: val, played_date: date })
      .select()
      .single();

    if (data && !error) {
      const updated = [data, ...scores].slice(0, 5);
      setScores(updated);
      setNewScore('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold">Your Draw Numbers</h3>
          <p className="text-xs text-slate-400">
            Submit Stableford scores (1-45). Your 5 most recent are your draw entries.
          </p>
        </div>
      </div>

      {/* Current scores */}
      <div className="grid grid-cols-5 gap-3">
        <AnimatePresence mode="popLayout">
          {[...Array(5)].map((_, i) => {
            const score = scores[i];
            return (
              <motion.div
                key={score?.id || `empty-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold ${
                  score
                    ? 'bg-gradient-to-br from-violet-600/30 to-rose-600/20 border border-violet-500/30'
                    : 'bg-white/5 border border-dashed border-white/10'
                }`}
              >
                {score ? score.score : '—'}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add new score */}
      <div className="flex gap-3">
        <Input
          type="number"
          min={1}
          max={45}
          placeholder="Score (1-45)"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          className="flex-1"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
        />
        <Button onClick={addScore} loading={loading} disabled={!newScore}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {scores.length > 0 && (
        <div className="space-y-2">
          {scores.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 text-sm">
              <div className="flex items-center gap-3">
                <span className="font-bold text-violet-400 w-8">{s.score}</span>
                <span className="text-slate-400">{new Date(s.played_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
