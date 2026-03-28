import { createClient } from '@/lib/supabase/server';
import CharityGrid from './CharityGrid';
import Badge from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export default async function CharitiesPage() {
  const supabase = await createClient();
  const { data: charities } = await supabase.from('charities').select('*').order('featured_status', { ascending: false });

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-24 space-y-4">
          <Badge variant="primary" className="mb-4">Global Vetting Active</Badge>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
             Mission <span className="gradient-text">Protocol</span>.
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Every score you enter generates a high-performance contribution. Select an vetted organization to link your athletic progress to global change.
          </p>
        </div>
        
        <CharityGrid charities={charities || []} />
      </div>
    </div>
  );
}
