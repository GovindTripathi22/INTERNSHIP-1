'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Heart, CreditCard, Loader2 } from 'lucide-react';

export default function DonateNow({ charities }: { charities: any[] }) {
  const [amount, setAmount] = useState<number>(25);
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/stripe/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, charityId: selectedCharity }),
      });
      const { url, error } = await resp.json();
      if (error) alert(error);
      else if (url) window.location.href = url;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="glass" className="relative group overflow-hidden border border-white/5">
      <div className="absolute top-0 right-0 p-8">
        <Heart className="w-12 h-12 text-secondary opacity-10 group-hover:opacity-30 transition-opacity" />
      </div>

      <div className="space-y-8 relative z-10">
        <div>
          <Badge variant="warning" className="mb-4">Independent Impact</Badge>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Direct Contribution</h3>
          <p className="text-slate-500 font-medium">One-time global impact without gameplay participation.</p>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Contribution Amount</div>
          <div className="grid grid-cols-3 gap-3">
            {[25, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-xl font-bold italic transition-all border ${
                  amount === val ? 'bg-primary text-surface-lowest border-primary' : 'bg-surface-container border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="5"
            placeholder="Custom Protocol Value ($)"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-lowest border-b border-white/10 py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-display text-sm italic"
          />
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Target Channel</div>
          <select
            value={selectedCharity}
            onChange={(e) => setSelectedCharity(e.target.value)}
            className="w-full bg-surface-container border border-white/5 rounded-xl py-3 px-4 text-slate-400 focus:text-white focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none font-medium text-sm"
          >
            <option value="">General Fund Protocol</option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Button 
          onClick={handleDonate} 
          disabled={isLoading} 
          className="w-full h-14 uppercase font-black italic tracking-widest gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          Execute Impact Payment
        </Button>
      </div>
    </Card>
  );
}
