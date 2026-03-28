import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { amount, charityId } = await request.json();

  if (!amount || amount < 5) {
    return NextResponse.json({ error: 'Minimum donation is $5' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Independent Impact Donation',
              description: 'One-time charitable contribution (Independent of gameplay)',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?donation=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?donation=cancelled`,
      metadata: {
        userId: user?.id || 'anonymous',
        charityId: charityId || 'general',
        type: 'donation',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
