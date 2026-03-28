import { createClient } from '@/lib/supabase/server';
import CharitySelector from '@/components/dashboard/CharitySelector';
import Card from '@/components/ui/Card';

export default async function UserCharityPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const { data: user } = await supabase.from('users').select('*').eq('id', authUser?.id).single();
  const { data: charities } = await supabase.from('charities').select('*');

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Charity Preference</h1>
        <p className="text-slate-400">Manage which cause your subscription supports and at what level.</p>
      </div>
      <Card>
        <CharitySelector
          charities={charities || []}
          selectedId={user?.selected_charity_id}
          contributionPct={user?.charity_contribution_pct || 10}
          userId={user?.id || ''}
        />
      </Card>
    </div>
  );
}
