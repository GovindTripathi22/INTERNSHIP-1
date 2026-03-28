import { createClient } from '@/lib/supabase/server';
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CreditCard, ExternalLink } from 'lucide-react';
import { stripe } from '@/lib/stripe';

export default async function UserSubscriptionPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', authUser?.id).single();

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Subscription</h1>
          <p className="text-slate-400">Manage your plan and billing information.</p>
        </div>
        <CreditCard className="w-8 h-8 text-slate-700" />
      </div>

      <SubscriptionStatus subscription={sub} />

      {sub?.stripe_customer_id && (
        <Card className="mt-6 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm">Billing Portal</h4>
            <p className="text-xs text-slate-400">Update payment methods or cancel plan.</p>
          </div>
          {/* In a real app, this would be a server action to generate a portal link */}
          <Button variant="secondary" size="sm">
            Launch Portal <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </Card>
      )}
    </div>
  );
}
