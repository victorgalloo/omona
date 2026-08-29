'use client';

import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { useT } from '@/contexts/LanguageContext';

export function PricingPageContent() {
  const t = useT();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-muted font-mono text-sm mb-4">{t.pricing.sectionLabel}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
            {t.pricing.heading}
          </h1>
          <p className="text-xl text-muted max-w-xl mx-auto">
            {t.pricing.subheading}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden mb-16">
          {/* Starter */}
          <div className="bg-background p-10">
            <p className="font-mono text-sm text-muted mb-2">{t.pricing.starter.label}</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-foreground">{t.pricing.starter.price}</span>
              <span className="text-muted mb-2">{t.pricing.starter.currency}</span>
            </div>
            <p className="text-sm text-muted mb-8">{t.pricing.starter.usd}</p>
            <Link
              href="/signup"
              className="block w-full text-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface transition-colors mb-8"
            >
              {t.pricing.starter.cta}
            </Link>
            <ul className="space-y-3">
              {t.pricing.starterFeatures.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-[#27C93F] mt-0.5 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted/40 mt-0.5 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted/40'}`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-surface p-10 relative">
            <div className="absolute top-4 right-4">
              <span className="text-xs font-mono bg-[#27C93F] text-background px-3 py-1 rounded-full font-bold">
                {t.pricing.pro.badge}
              </span>
            </div>
            <p className="font-mono text-sm text-muted mb-2">{t.pricing.pro.label}</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-foreground">{t.pricing.pro.price}</span>
              <span className="text-muted mb-2">{t.pricing.pro.currency}</span>
            </div>
            <p className="text-sm text-muted mb-8">{t.pricing.pro.usd}</p>
            <Link
              href="/signup"
              className="block w-full text-center rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity mb-8"
            >
              {t.pricing.pro.cta}
            </Link>
            <ul className="space-y-3">
              {t.pricing.proFeatures.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#27C93F] mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden mb-16">
          {t.pricing.stats.map((stat) => (
            <div key={stat.label} className="bg-background p-8 text-center">
              <span className="text-3xl font-black text-foreground block">{stat.value}</span>
              <span className="text-sm text-muted mt-1 block">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-black text-foreground mb-8">{t.pricing.faqHeading}</h2>
          <div className="space-y-px bg-border rounded-2xl overflow-hidden">
            {t.pricing.faqs.map((faq) => (
              <div key={faq.q} className="bg-background p-8">
                <h3 className="font-bold text-foreground mb-3">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted mb-6">{t.pricing.bottomCta.text}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-4 text-base font-medium text-background hover:opacity-90 transition-opacity"
            >
              {t.pricing.bottomCta.primary}
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=529849800629"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-surface transition-colors"
            >
              {t.pricing.bottomCta.secondary}
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {t.footer.copyright} ·{' '}
            <Link href="/" className="hover:text-foreground transition-colors">
              {t.blog.backToHome}
            </Link>
            {' · '}
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
