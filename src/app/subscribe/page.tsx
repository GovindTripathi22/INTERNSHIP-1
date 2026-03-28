'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Check, Rocket, Zap, Crown, Target, Heart } from 'lucide-react';
import { createCheckoutSession } from '@/app/api/stripe/checkout/actions';
import DonateNow from '@/components/home/DonateNow';
import { createClient } from '@/lib/supabase/client';

const plans = [
  {
    name: "Standard Protocol",
    price: "$19",
    period: "monthly",
    description: "Initialize your athletic impact and join the monthly draw infrastructure.",
    features: [
      "Access to Draw Engine",
      "Impact Statistics Oversight",
      "5 Score Persistence Protocol",
      "Basic Charity Contribution"
    ],
    highlight: false,
    color: "primary"
  },
  {
    name: "Strategic Yearly",
    price: "$190",
    period: "yearly",
    description: "Maximum efficiency for recurring impact and long-term athletic tracking. Save 15%.",
    features: [
      "All Standard Features",
      "Priority Verification Payouts",
      "Strategic Impact Modeling",
      "Platform Governance Access"
    ],
    highlight: true,
    color: "secondary"
  }
];

export default function SubscriptionPricing() {
  const [charities, setCharities] = useState<any[]>([]);

  useEffect(() => {
    async function getCharities() {
      const supabase = createClient();
      const { data } = await supabase.from('charities').select('id, name');
      setCharities(data || []);
    }
    getCharities();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center mb-24 space-y-4">
          <Badge variant="primary" className="mb-4">Selection Portal</Badge>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Initialize <span className="gradient-text">Impact</span>.
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Choose your contribution protocol. Your subscription directly supports global charities while granting you access to the prize infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <Card variant="glass" className={`h-full flex flex-col p-8 group ${plan.highlight ? 'neon-glow' : 'border border-white/5'}`}>
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <h3 className="text-lg font-black italic uppercase tracking-tight mb-2">{plan.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black italic tracking-tighter">{plan.price}</span>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ {plan.period}</span>
                          </div>
                        </div>
                        {plan.highlight ? <Crown className="w-6 h-6 text-secondary" /> : <Zap className="w-6 h-6 text-primary" />}
                      </div>

                      <div className="space-y-4 mb-10 flex-grow">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-surface-container-high flex items-center justify-center p-1 border border-white/5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-semibold text-slate-300 tracking-tight">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full h-12 text-sm font-black italic uppercase tracking-widest"
                        variant={plan.highlight ? 'primary' : 'secondary'}
                      >
                        Initialize
                      </Button>
                    </Card>
                  </motion.div>
                ))}
             </div>
             
             {/* Security Badge Card */}
             <Card variant="obsidian" className="p-8 border border-white/5 flex items-center justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Encrypted Gateway</div>
                   <div className="text-sm font-bold text-white uppercase italic tracking-tighter">128-Bit Infrastructure v.2.0</div>
                </div>
                <Rocket className="w-8 h-8 text-primary opacity-20" />
             </Card>
          </div>

          <div className="lg:sticky lg:top-24">
             <DonateNow charities={charities} />
          </div>
        </div>

        {/* Global Stats Highlight */}
        <div className="mt-32 border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto opacity-50">
            <div>
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Charity Min.</div>
                <div className="text-2xl font-black italic uppercase underline decoration-primary/50 underline-offset-8 decoration-2">10% Protocol</div>
            </div>
            <div>
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Security Standard</div>
                <div className="text-2xl font-black italic uppercase underline decoration-secondary/50 underline-offset-8 decoration-2">SSL-256 Bit</div>
            </div>
            <div>
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Governance</div>
                <div className="text-2xl font-black italic uppercase underline decoration-primary/50 underline-offset-8 decoration-2">Player-Led</div>
            </div>
        </div>
      </div>
    </section>
  );
}
