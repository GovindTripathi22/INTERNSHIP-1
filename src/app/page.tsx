import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ImpactStats from '@/components/home/ImpactStats';
import CharityShowcase from '@/components/home/CharityShowcase';
import CTASection from '@/components/home/CTASection';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('featured_status', true)
    .limit(3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ImpactStats />
        <CharityShowcase charities={charities || []} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
