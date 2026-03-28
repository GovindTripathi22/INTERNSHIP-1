'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Target, Heart, CreditCard, Trophy,
  Users, Gift, Dices, ShieldCheck, BarChart3, LogOut, Menu, X, ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const userLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/scores', label: 'My Scores', icon: Target },
  { href: '/dashboard/charity', label: 'My Charity', icon: Heart },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/winnings', label: 'Winnings', icon: Trophy },
];

const adminLinks = [
  { href: '/admin', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/charities', label: 'Charities', icon: Gift },
  { href: '/admin/draws', label: 'Draws', icon: Dices },
  { href: '/admin/winners', label: 'Winners', icon: ShieldCheck },
];

export default function DashboardShell({
  children,
  role = 'user',
}: {
  children: React.ReactNode;
  role?: 'user' | 'admin';
}) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : userLinks;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          {!collapsed && <span className="font-bold text-sm">BirdieFund</span>}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block p-1 hover:bg-white/10 rounded-lg">
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        {role === 'admin' && (
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 mb-1"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && <span>User View</span>}
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 shrink-0',
          collapsed ? 'w-[68px]' : 'w-60'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 z-50 w-60 bg-slate-950 border-r border-white/5 md:hidden"
        >
          <SidebarContent />
        </motion.div>
      )}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden p-4 border-b border-white/5 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">{role === 'admin' ? 'Admin' : 'Dashboard'}</span>
        </div>
        <div className="p-4 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
