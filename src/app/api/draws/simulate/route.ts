import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { simulateDraw } from '@/lib/draw-engine';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check if admin
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { month, type = 'random' } = await request.json();
  if (!month) return NextResponse.json({ error: 'Month is required' }, { status: 400 });

  try {
    const result = await simulateDraw(month, type as 'random' | 'algorithmic');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
