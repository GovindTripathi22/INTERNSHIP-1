import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Users, Mail, Shield } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from('users').select('*, subscriptions(status, plan_type)').order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">User Management</h1>
          <p className="text-sm text-slate-400">View and manage all registered users.</p>
        </div>
        <Users className="w-8 h-8 text-slate-700" />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((u) => (
                <tr key={u.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-xs font-bold text-violet-400">
                        {u.email?.[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-200">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'admin' ? 'info' : 'neutral'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {u.subscriptions?.[0] ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="capitalize font-medium">{u.subscriptions[0].plan_type}</span>
                        <Badge variant={u.subscriptions[0].status === 'active' ? 'success' : 'danger'}>
                          {u.subscriptions[0].status}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
