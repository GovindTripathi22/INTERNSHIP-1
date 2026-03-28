import { supabaseAdmin } from './supabase/admin';
import type { DrawSimulationResult } from '@/types';
import { MONTHLY_PRICE, YEARLY_PRICE } from './utils';

function generateWinningNumbers(type: 'random' | 'algorithmic' = 'random', activeScores: number[] = []): number[] {
  const numbers = new Set<number>();
  
  if (type === 'random' || activeScores.length === 0) {
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
  } else {
    const frequency: Record<number, number> = {};
    activeScores.forEach(s => frequency[s] = (frequency[s] || 0) + 1);
    
    const sortedByFreq = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(e => parseInt(e[0]));

    sortedByFreq.slice(0, 3).forEach(n => numbers.add(n));
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

export async function simulateDraw(month: string, type: 'random' | 'algorithmic' = 'random'): Promise<DrawSimulationResult> {
  const { data: subs } = await supabaseAdmin.from('subscriptions').select('user_id, plan_type').eq('status', 'active');
  if (!subs || subs.length === 0) throw new Error('No active subscribers');

  const userIds = subs.map((s) => s.user_id);
  const { data: users } = await supabaseAdmin.from('users').select('id, email, charity_contribution_pct').in('id', userIds);
  const { data: allScores } = await supabaseAdmin.from('scores').select('user_id, score').in('user_id', userIds).order('created_at', { ascending: false });

  let totalRevenue = 0;
  let charityTotal = 0;
  const userMap = new Map(users?.map((u) => [u.id, u]) || []);

  for (const sub of subs) {
    const fee = sub.plan_type === 'yearly' ? YEARLY_PRICE / 12 : MONTHLY_PRICE;
    const user = userMap.get(sub.user_id);
    const charityPct = (user?.charity_contribution_pct || 10) / 100;
    totalRevenue += fee;
    charityTotal += fee * charityPct;
  }

  const { data: lastDraw } = await supabaseAdmin.from('draws').select('rollover_amount').eq('status', 'published').order('month', { ascending: false }).limit(1);
  const rolloverIn = lastDraw?.[0]?.rollover_amount || 0;
  const prizePool = totalRevenue - charityTotal + rolloverIn;

  const scorePool = allScores?.map(s => s.score) || [];
  const winningNumbers = generateWinningNumbers(type, scorePool);

  const scoresByUser = new Map<string, number[]>();
  for (const sc of allScores || []) {
    const existing = scoresByUser.get(sc.user_id) || [];
    if (existing.length < 5) {
      existing.push(sc.score);
      scoresByUser.set(sc.user_id, existing);
    }
  }

  const matchResults: any[] = [];
  for (const [userId, scores] of scoresByUser) {
    const matched = scores.filter((s) => new Set(winningNumbers).has(s));
    if (matched.length >= 3) {
      matchResults.push({ user_id: userId, email: userMap.get(userId)?.email || '', matched, tier: matched.length > 5 ? 5 : matched.length });
    }
  }

  const tier5Winners = matchResults.filter((m) => m.tier === 5);
  const tier4Winners = matchResults.filter((m) => m.tier === 4);
  const tier3Winners = matchResults.filter((m) => m.tier === 3);

  // Pool split
  const t5Pool = prizePool * 0.4;
  const t4Pool = prizePool * 0.35;
  const t3Pool = prizePool * 0.25;

  let rolloverOut = 0;
  if (tier5Winners.length === 0) {
    rolloverOut = t5Pool; // Explicit Jackpot Rollover
  }

  const calcShare = (pool: number, count: number) => (count > 0 ? pool / count : 0);

  const winners = [
    ...tier5Winners.map((w) => ({ user_id: w.user_id, email: w.email, match_tier: 5, prize_share: calcShare(t5Pool, tier5Winners.length) })),
    ...tier4Winners.map((w) => ({ user_id: w.user_id, email: w.email, match_tier: 4, prize_share: calcShare(t4Pool, tier4Winners.length) })),
    ...tier3Winners.map((w) => ({ user_id: w.user_id, email: w.email, match_tier: 3, prize_share: calcShare(t3Pool, tier3Winners.length) })),
  ];

  return {
    draw: { month, winning_numbers: winningNumbers, type, status: 'simulation', total_pool: prizePool, rollover_amount: rolloverOut, charity_total: charityTotal },
    winners,
    pool_breakdown: { total_revenue: totalRevenue, charity_total: charityTotal, prize_pool: prizePool, tier5_pool: t5Pool, tier4_pool: t4Pool, tier3_pool: t3Pool, rollover: rolloverOut }
  };
}

export async function publishDraw(result: any): Promise<string> {
  const { data: draw, error } = await supabaseAdmin.from('draws').insert({
    month: result.draw.month,
    winning_numbers: result.draw.winning_numbers,
    type: result.draw.type,
    status: 'published',
    total_pool: result.draw.total_pool,
    rollover_amount: result.draw.rollover_amount, // Explicit save
    charity_total: result.draw.charity_total,
  }).select().single();

  if (error) throw error;

  if (result.winners.length > 0) {
    const winnerRows = result.winners.map((w: any) => ({
      draw_id: draw.id,
      user_id: w.user_id,
      match_tier: w.match_tier,
      prize_share: w.prize_share,
    }));
    await supabaseAdmin.from('winners').insert(winnerRows);
  }

  return draw.id;
}
