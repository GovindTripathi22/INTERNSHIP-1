import { supabaseAdmin } from './supabase/admin';
import type { DrawSimulationResult } from '@/types';
import { MONTHLY_PRICE, YEARLY_PRICE } from './utils';

/**
 * Generates winning numbers based on the requested type.
 * @param type 'random' or 'algorithmic'
 * @param activeScores Optional array of current scores to weight the algorithm
 */
function generateWinningNumbers(type: 'random' | 'algorithmic' = 'random', activeScores: number[] = []): number[] {
  const numbers = new Set<number>();
  
  if (type === 'random' || activeScores.length === 0) {
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
  } else {
    // Algorithmic: The "Clarity Algorithm"
    // We weight numbers that appear most frequently in the user scores to create a "Community Resonance" feel.
    const frequency: Record<number, number> = {};
    activeScores.forEach(s => frequency[s] = (frequency[s] || 0) + 1);
    
    const sortedByFreq = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(e => parseInt(e[0]));

    // Take top 3 resonant numbers, 2 random ones
    sortedByFreq.slice(0, 3).forEach(n => numbers.add(n));
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

function countMatches(userScores: number[], winningNumbers: number[]): number {
  const winSet = new Set(winningNumbers);
  return userScores.filter((s) => winSet.has(s)).length;
}

export async function simulateDraw(month: string, type: 'random' | 'algorithmic' = 'random'): Promise<DrawSimulationResult> {
  // 1. Get all active subscribers with their scores and charity %
  const { data: subs } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, plan_type')
    .eq('status', 'active');

  if (!subs || subs.length === 0) {
    throw new Error('No active subscribers for this draw period');
  }

  const userIds = subs.map((s) => s.user_id);

  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, email, charity_contribution_pct')
    .in('id', userIds);

  const { data: allScores } = await supabaseAdmin
    .from('scores')
    .select('user_id, score')
    .in('user_id', userIds)
    .order('created_at', { ascending: false });

  // 2. Calculate total revenue and charity deductions
  let totalRevenue = 0;
  let charityTotal = 0;

  const userMap = new Map(users?.map((u) => [u.id, u]) || []);
  const subMap = new Map(subs.map((s) => [s.user_id, s]));

  for (const sub of subs) {
    const fee = sub.plan_type === 'yearly' ? YEARLY_PRICE / 12 : MONTHLY_PRICE;
    const user = userMap.get(sub.user_id);
    const charityPct = (user?.charity_contribution_pct || 10) / 100;
    totalRevenue += fee;
    charityTotal += fee * charityPct;
  }

  const prizePool = totalRevenue - charityTotal;

  // 3. Check for previous rollover
  const { data: lastDraw } = await supabaseAdmin
    .from('draws')
    .select('rollover_amount')
    .eq('status', 'published')
    .order('month', { ascending: false })
    .limit(1);

  const rolloverIn = lastDraw?.[0]?.rollover_amount || 0;
  const adjustedPool = prizePool + rolloverIn;

  // Pool split (Standard industry weighting)
  const tier5Pool = adjustedPool * 0.4;
  const tier4Pool = adjustedPool * 0.35;
  const tier3Pool = adjustedPool * 0.25;

  // 4. Generate winning numbers (Algorithmic support)
  const scorePool = allScores?.map(s => s.score) || [];
  const winningNumbers = generateWinningNumbers(type, scorePool);

  // 5. Group scores by user (max 5 each)
  const scoresByUser = new Map<string, number[]>();
  for (const sc of allScores || []) {
    const existing = scoresByUser.get(sc.user_id) || [];
    if (existing.length < 5) {
      existing.push(sc.score);
      scoresByUser.set(sc.user_id, existing);
    }
  }

  // 6. Determine matches
  const matchResults: { user_id: string; email: string; matched: number[]; tier: number }[] = [];

  for (const [userId, scores] of scoresByUser) {
    const matched = scores.filter((s) => new Set(winningNumbers).has(s));
    if (matched.length >= 3) {
      matchResults.push({
        user_id: userId,
        email: userMap.get(userId)?.email || '',
        matched,
        tier: matched.length > 5 ? 5 : matched.length,
      });
    }
  }

  // 7. Calculate prizes
  const tier5Winners = matchResults.filter((m) => m.tier === 5);
  const tier4Winners = matchResults.filter((m) => m.tier === 4);
  const tier3Winners = matchResults.filter((m) => m.tier === 3);

  let rolloverOut = 0;
  const calcShare = (pool: number, count: number) => (count > 0 ? pool / count : 0);

  // If no one matches all 5, rollover to next month
  if (tier5Winners.length === 0) rolloverOut = tier5Pool;

  const winners = [
    ...tier5Winners.map((w) => ({
      user_id: w.user_id,
      email: w.email,
      matched_numbers: w.matched,
      match_tier: 5,
      prize_share: calcShare(tier5Pool, tier5Winners.length),
    })),
    ...tier4Winners.map((w) => ({
      user_id: w.user_id,
      email: w.email,
      matched_numbers: w.matched,
      match_tier: 4,
      prize_share: calcShare(tier4Pool, tier4Winners.length),
    })),
    ...tier3Winners.map((w) => ({
      user_id: w.user_id,
      email: w.email,
      matched_numbers: w.matched,
      match_tier: 3,
      prize_share: calcShare(tier3Pool, tier3Winners.length),
    })),
  ];

  return {
    draw: {
      month,
      winning_numbers: winningNumbers,
      type,
      status: 'simulation',
      total_pool: adjustedPool,
      rollover_amount: rolloverOut,
      charity_total: charityTotal,
    },
    winners,
    pool_breakdown: {
      total_revenue: totalRevenue,
      charity_total: charityTotal,
      prize_pool: adjustedPool,
      tier5_pool: tier5Pool,
      tier4_pool: tier4Pool,
      tier3_pool: tier3Pool,
      rollover: rolloverOut,
    },
  };
}

export async function publishDraw(simulationResult: DrawSimulationResult): Promise<string> {
  // Insert the draw
  const { data: draw, error: drawErr } = await supabaseAdmin
    .from('draws')
    .insert({
      month: simulationResult.draw.month,
      winning_numbers: simulationResult.draw.winning_numbers,
      type: simulationResult.draw.type,
      status: 'published',
      total_pool: simulationResult.draw.total_pool,
      rollover_amount: simulationResult.draw.rollover_amount,
      charity_total: simulationResult.draw.charity_total,
    })
    .select()
    .single();

  if (drawErr || !draw) throw new Error(drawErr?.message || 'Failed to create draw');

  // Insert winners
  if (simulationResult.winners.length > 0) {
    const winnerRows = simulationResult.winners.map((w) => ({
      draw_id: draw.id,
      user_id: w.user_id,
      match_tier: w.match_tier,
      prize_share: w.prize_share,
    }));

    const { error: winErr } = await supabaseAdmin.from('winners').insert(winnerRows);
    if (winErr) throw new Error(winErr.message);
  }

  return draw.id;
}
