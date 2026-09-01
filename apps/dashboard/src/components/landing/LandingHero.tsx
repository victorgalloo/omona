'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';

const FLOATING_SHAPES = [
  { size: 6,  x: '15%', y: '20%', delay: 0,   duration: 7  },
  { size: 4,  x: '80%', y: '15%', delay: 1,   duration: 9  },
  { size: 8,  x: '10%', y: '70%', delay: 2,   duration: 8  },
  { size: 5,  x: '85%', y: '65%', delay: 0.5, duration: 10 },
  { size: 3,  x: '50%', y: '85%', delay: 1.5, duration: 6  },
  { size: 7,  x: '70%', y: '40%', delay: 3,   duration: 11 },
];

function ChatDemo() {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-surface-2 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-xs text-muted font-mono ml-2">whatsapp_demo</span>
        </div>
        <div className="p-4 space-y-3">
          {t.hero.chat.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.35 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-foreground text-background'
                    : 'bg-surface-2 text-foreground border border-border'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="flex justify-start"
          >
            <div className="bg-surface-2 border border-border px-4 py-3 rounded-2xl flex items-center gap-1.5">
              {[0, 0.2, 0.4].map((d, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d }}
                  className="w-2 h-2 rounded-full bg-[#27C93F]"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function LandingHero() {
  const t = useT();
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {FLOATING_SHAPES.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size * 4,
            height: shape.size * 4,
            left: shape.x,
            top: shape.y,
            background: 'rgba(250,250,250,0.05)',
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: shape.duration, repeat: Infinity, delay: shape.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-4 py-2 text-sm text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#27C93F]" />
              {t.hero.badge}
            </div>
          </div>

          <p className="mb-4 font-mono text-sm text-muted animate-in fade-in duration-500">
            omona<span className="animate-blink text-[#27C93F]">_</span>
          </p>

          <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-3 duration-700">
            {t.hero.tagline}
          </h1>

          <p
            id="hero-description"
            className="text-lg lg:text-xl text-muted mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-700"
          >
            {t.hero.subtagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in duration-700">
            <Link
              href="/signup"
              className="group relative overflow-hidden flex items-center justify-center gap-2 rounded-lg bg-foreground px-8 py-4 text-base font-medium text-background shadow-lg transition-all hover:opacity-90"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=529849800629"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-surface hover:border-border-hover"
            >
              <MessageCircle className="h-4 w-4" />
              {t.hero.whatsapp}
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center lg:items-start gap-1 animate-in fade-in duration-700">
            <p className="text-sm text-muted">{t.hero.setup}</p>
            <p className="text-xs text-muted/60">{t.hero.companies}</p>
          </div>
        </div>

        <div className="hidden lg:block">
          <ChatDemo />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-muted/50"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
