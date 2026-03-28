import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { publishDraw } from '@/lib/draw-engine';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const simulationResult = await request.json();

  try {
    const drawId = await publishDraw(simulationResult);
    return NextResponse.json({ success: true, drawId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
