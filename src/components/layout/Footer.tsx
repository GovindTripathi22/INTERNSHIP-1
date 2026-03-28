import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold">BirdieFund</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Every subscription fuels charitable impact. We believe the joy of sport should
              ripple outward, touching lives far beyond the course.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <Link href="/subscribe" className="block hover:text-white transition-colors">Pricing</Link>
              <Link href="/charities" className="block hover:text-white transition-colors">Charities</Link>
              <Link href="/auth/signup" className="block hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <span className="block">Privacy Policy</span>
              <span className="block">Terms of Service</span>
              <span className="block">Cookie Policy</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} BirdieFund. Built with purpose.
        </div>
      </div>
    </footer>
  );
}
