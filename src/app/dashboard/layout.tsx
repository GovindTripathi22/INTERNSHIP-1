'use client';

import DashboardShell from '@/components/layout/DashboardShell';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="user">{children}</DashboardShell>;
}
