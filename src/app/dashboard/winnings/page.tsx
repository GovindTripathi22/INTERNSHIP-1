import { createClient } from '@/lib/supabase/server';
import WinningsCard from '@/components/dashboard/WinningsCard';

export default async function UserWinningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: winnings } = await supabase
    .from('winners')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Winnings</h1>
        <p className="text-slate-400">Track your prize wins and upload verification proof to claim.</p>
      </div>

      <WinningsCard winners={winnings || []} />
    </div>
  );
}
