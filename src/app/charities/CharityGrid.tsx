'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Heart, Search, Star, ExternalLink, Globe } from 'lucide-react';
import type { Charity } from '@/types';

export default function CharityGrid({ charities }: { charities: Charity[] }) {
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = charities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFeatured = featuredOnly ? c.featured_status : true;
    return matchesSearch && matchesFeatured;
  });

  return (
    <div className="space-y-12">
      {/* Technical Search Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search Global Causes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border-b border-white/5 py-4 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-primary transition-all placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.3em] font-display"
          />
        </div>
        <button
          onClick={() => setFeaturedOnly(!featuredOnly)}
          className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
            featuredOnly ? 'bg-primary text-surface-lowest shadow-[0_0_20px_rgba(0,255,255,0.3)]' : 'glass text-slate-400 group hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-current' : 'group-hover:text-primary'}`} />
          Featured Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((charity, i) => (
            <motion.div
              key={charity.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" className="h-full flex flex-col p-0 group overflow-hidden border border-white/5 transition-all hover:neon-glow">
                <div className="relative h-56 overflow-hidden">
                   {charity.image_url && (
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-lowest via-transparent to-transparent opacity-80" />
                  
                  {charity.featured_status && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="primary" className="shadow-2xl">Featured</Badge>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white drop-shadow-md">
                      {charity.name}
                    </h3>
                  </div>
                </div>

                <div className="p-8 flex-grow space-y-6">
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {charity.description}
                  </p>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                       <Globe className="w-4 h-4 text-slate-600 hover:text-primary cursor-pointer transition-colors" />
                       <ExternalLink className="w-4 h-4 text-slate-600 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest h-8 px-4 border border-white/5">
                      Select Cause
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 space-y-4">
           <Heart className="w-12 h-12 text-slate-800 mx-auto" />
           <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">No active charity protocols match search sequence.</p>
        </div>
      )}
    </div>
  );
}
