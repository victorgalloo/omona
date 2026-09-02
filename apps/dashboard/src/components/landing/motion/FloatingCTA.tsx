'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ManyChat mantiene un "Get started free" fijo abajo a la derecha durante todo
 * el scroll: la acción nunca queda a más de un clic. Aquí aparece cuando el
 * hero ya salió de pantalla, para no duplicar el CTA del hero.
 */
export function FloatingCTA({ label }: { label: string }) {
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const past = y > (typeof window === 'undefined' ? 800 : window.innerHeight * 0.9);
    setShown((current) => (current === past ? current : past));
  });

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          // bottom-20 deja libre la esquina que ocupa GlobalThemeToggle
          className="fixed bottom-20 right-4 z-40 hidden sm:block"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-xl transition-opacity hover:opacity-90"
          >
            {label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
