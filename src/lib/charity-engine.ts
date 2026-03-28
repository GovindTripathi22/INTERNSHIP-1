import { supabaseAdmin } from './supabase/admin';
import { MONTHLY_PRICE, YEARLY_PRICE } from './utils';

export interface CharityDistribution {
  charity_id: string;
  charity_name: string;
  total_amount: number;
  contributor_count: number;
}

export async function calculateCharityDistributions(): Promise<CharityDistribution[]> {
  // Get all active subscribers with their user info
  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, plan_type')
    .eq('status', 'active');

  if (!subs || subs.length === 0) return [];

  const userIds = subs.map((s) => s.user_id);

  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, selected_charity_id, charity_contribution_pct')
    .in('id', userIds)
    .not('selected_charity_id', 'is', null);

  if (!users || users.length === 0) return [];

  const { data: charities } = await supabaseAdmin.from('charities').select('id, name');
  const charityMap = new Map(charities?.map((c) => [c.id, c.name]) || []);
  const subMap = new Map(subs.map((s) => [s.user_id, s]));

  // Aggregate by charity
  const distributions = new Map<string, { amount: number; count: number }>();

  for (const user of users) {
    if (!user.selected_charity_id) continue;
    const sub = subMap.get(user.id);
    if (!sub) continue;

    const monthlyFee = sub.plan_type === 'yearly' ? YEARLY_PRICE / 12 : MONTHLY_PRICE;
    const contribution = monthlyFee * (user.charity_contribution_pct / 100);

    const existing = distributions.get(user.selected_charity_id) || { amount: 0, count: 0 };
    existing.amount += contribution;
    existing.count += 1;
    distributions.set(user.selected_charity_id, existing);
  }

  return Array.from(distributions.entries()).map(([charityId, data]) => ({
    charity_id: charityId,
    charity_name: charityMap.get(charityId) || 'Unknown',
    total_amount: Math.round(data.amount * 100) / 100,
    contributor_count: data.count,
  }));
}
