'use client';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Subscription } from '@/types';
import { CreditCard, Calendar, ExternalLink } from 'lucide-react';
import { formatDate, formatCurrency, MONTHLY_PRICE, YEARLY_PRICE } from '@/lib/utils';
import Link from 'next/link';

export default function SubscriptionStatus({ subscription }: { subscription: Subscription | null }) {
  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CreditCard className="w-10 h-10 text-slate-500 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2">No Active Subscription</h3>
        <p className="text-sm text-slate-400 mb-6">
          Subscribe to enter monthly draws and support your chosen charity.
        </p>
        <Link href="/subscribe">
          <Button>Subscribe Now</Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
    active: 'success',
    past_due: 'warning',
    canceled: 'danger',
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-violet-400" />
          Subscription
        </h3>
        <Badge variant={statusColors[subscription.status] || 'neutral'}>
          {subscription.status}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Plan</span>
          <span className="font-medium capitalize">{subscription.plan_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Amount</span>
          <span className="font-medium">
            {formatCurrency(subscription.plan_type === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE)}
            /{subscription.plan_type === 'yearly' ? 'yr' : 'mo'}
          </span>
        </div>
        {subscription.current_period_end && (
          <div className="flex justify-between">
            <span className="text-slate-400">Renews</span>
            <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
