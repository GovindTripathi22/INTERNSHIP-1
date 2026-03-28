import DrawSimulator from '@/components/admin/DrawSimulator';
import Card from '@/components/ui/Card';
import { Dices } from 'lucide-react';

export default function AdminDrawsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Monthly Draws</h1>
        <p className="text-slate-400">Run simulations, generate winning numbers, and publish monthly results.</p>
      </div>

      <Card className="border-violet-500/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/20 flex items-center justify-center">
            <Dices className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Draw Engine Control</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Administrator Only</p>
          </div>
        </div>

        <DrawSimulator />
      </Card>
    </div>
  );
}
