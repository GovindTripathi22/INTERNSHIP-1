import Link from 'next/link';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-slate-400 mb-8">
          The authentication link was invalid or has expired. Please try signing in again or
          request a new signup link.
        </p>
        <div className="space-y-3">
          <Link href="/auth/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="ghost" className="w-full">Create New Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
