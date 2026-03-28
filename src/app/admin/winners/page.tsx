import { createClient } from '@/lib/supabase/server';
import WinnerVerification from '@/components/admin/WinnerVerification';
import { ShieldCheck } from 'lucide-react';

export default async function AdminWinnersPage() {
  const supabase = await createClient();
  const { data: winners } = await supabase
    .from('winners')
    .select('*, users(email)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Winner Verification</h1>
          <p className="text-sm text-slate-400">Review uploaded proof and approve prize distribution.</p>
        </div>
        <ShieldCheck className="w-8 h-8 text-slate-700" />
      </div>

      <WinnerVerification winners={winners || []} />
    </div>
  );
}
