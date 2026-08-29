'use client';

import Link from 'next/link';
import { BLOG_POSTS, type BlogPost } from '@/lib/blog';
import { LandingNav } from '@/components/landing/LandingNav';
import { useLanguage } from '@/contexts/LanguageContext';

export function BlogPostContent({ post }: { post: BlogPost }) {
  const { lang, t } = useLanguage();
  const content = lang === 'en' ? post.en : post.es;
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const readTimeLabel = lang === 'en' ? `${post.readTime} min read` : `${post.readTime} min de lectura`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-10 font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">loomi.lat</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">{t.blog.backToBlog}</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{post.slug}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-muted bg-surface border border-border rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-6">
            {content.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted font-mono border-t border-border pt-4">
            <span>
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>·</span>
            <span>{readTimeLabel}</span>
            <span>·</span>
            <span>{t.blog.by}</span>
          </div>
        </header>

        {/* Content */}
        <article className="space-y-10">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.body.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-muted leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-surface border border-border">
          <p className="text-muted font-mono text-sm mb-2">loomi_</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t.blog.cta.heading}
          </h2>
          <p className="text-muted mb-6">
            {t.blog.cta.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              {t.blog.cta.primary}
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
            >
              {t.blog.cta.secondary}
            </Link>
          </div>
        </div>

        {/* More posts */}
        <div className="mt-16">
          <h3 className="text-sm font-mono text-muted mb-6">{t.blog.relatedPosts}</h3>
          <div className="space-y-px bg-border rounded-2xl overflow-hidden">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((related) => {
                const relatedContent = lang === 'en' ? related.en : related.es;
                return (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block bg-background p-6 hover:bg-surface transition-colors"
                  >
                    <h4 className="font-semibold text-foreground group-hover:text-[#27C93F] transition-colors mb-1">
                      {relatedContent.title}
                    </h4>
                    <p className="text-sm text-muted">{related.readTime} {t.blog.readTime}</p>
                  </Link>
                );
              })}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
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
