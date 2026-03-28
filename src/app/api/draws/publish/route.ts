import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { publishDraw } from '@/lib/draw-engine';
import { sendEmail, templates } from '@/lib/email';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const simulationResult = await request.json();

  try {
    const drawId = await publishDraw(simulationResult);

    // BACKGROUND TASK: Email Notifications
    // 1. Alert all active subscribers about new results
    const { data: subscribers } = await supabase.from('users').select('email').not('email', 'is', null);
    
    if (subscribers && subscribers.length > 0) {
      await Promise.all(
        subscribers.map((s) => 
          sendEmail({
            to: s.email!,
            subject: `Golf Clarity: Draw Results for ${simulationResult.draw.month}`,
            html: templates.drawResults(simulationResult.draw.month),
          })
        )
      );
    }

    // 2. Alert winners specifically
    if (simulationResult.winners && simulationResult.winners.length > 0) {
      await Promise.all(
        simulationResult.winners.map((w: any) => 
          sendEmail({
            to: w.email,
            subject: 'Protocol Alert: You are a Winner!',
            html: templates.winnerAlert(w.prize_share),
          })
        )
      );
    }

    return NextResponse.json({ success: true, drawId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
