import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Gift, Plus, ExternalLink, Heart } from 'lucide-react';

export default async function AdminCharitiesPage() {
  const supabase = await createClient();
  const { data: charities } = await supabase.from('charities').select('*').order('name');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Charity Partners</h1>
          <p className="text-sm text-slate-400">Manage charity organizations on the platform.</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          Add Charity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities?.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600/20 flex items-center justify-center">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Heart className="w-6 h-6 text-rose-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <Badge variant={c.featured_status ? 'warning' : 'neutral'}>
                    {c.featured_status ? 'Featured' : 'Standard'}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{c.description}</p>
            <div className="pt-4 border-t border-white/5 flex gap-2">
              <Button variant="secondary" size="sm" className="w-full text-xs">Analytics</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
