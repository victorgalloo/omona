'use client';

import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';
import { LandingNav } from '@/components/landing/LandingNav';
import { useLanguage } from '@/contexts/LanguageContext';

export function BlogListContent() {
  const { lang, t } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <p className="text-muted font-mono text-sm mb-4">{t.blog.sectionLabel}</p>
          <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-4">
            {t.blog.heading}
          </h1>
          <p className="text-xl text-muted max-w-xl">
            {t.blog.subheading}
          </p>
        </div>

        {/* Post list */}
        <div className="space-y-px bg-border rounded-2xl overflow-hidden">
          {BLOG_POSTS.map((post) => {
            const content = lang === 'en' ? post.en : post.es;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-background p-8 hover:bg-surface transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono text-muted bg-surface border border-border rounded-full px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#27C93F] transition-colors">
                      {content.title}
                    </h2>
                    <p className="text-muted text-sm leading-relaxed line-clamp-2">
                      {content.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted font-mono">
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-muted mt-1">{post.readTime} {t.blog.readTime}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {t.footer.copyright} ·{' '}
            <Link href="/" className="hover:text-foreground transition-colors">
              {t.blog.backToHome}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
