import { Navbar } from '@/components/omona/Navbar';
import { Hero } from '@/components/omona/Hero';
import { Stats } from '@/components/omona/stats';
import { HowItWorks } from '@/components/omona/how-it-works';
import { InteractiveDemo } from '@/components/omona/interactive-demo';
import { DashboardPreview } from '@/components/omona/dashboard-preview';
import { UseCases } from '@/components/omona/use-cases';
import { MetaLoop } from '@/components/omona/meta-loop';
import { Integrations } from '@/components/omona/integrations';
import { Pricing } from '@/components/omona/Pricing';
import { Testimonials } from '@/components/omona/Testimonials';
import { CTA } from '@/components/omona/cta';
import { Footer } from '@/components/omona/Footer';
import { LoadingScreen } from '@/components/ui/loading-screen';

function SectionDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="border-t border-dashed border-border" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <InteractiveDemo />
        <SectionDivider />
        <DashboardPreview />
        <SectionDivider />
        <UseCases />
        <SectionDivider />
        <MetaLoop />
        <SectionDivider />
        <Integrations />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
