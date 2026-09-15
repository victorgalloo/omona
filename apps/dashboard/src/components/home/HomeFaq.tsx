'use client';

import { Plus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';

/**
 * FAQ con <details> nativo.
 *
 * La versión anterior llevaba estado en React y AnimatePresence animando
 * `height: auto`, que es el caso que obliga al navegador a medir el contenido
 * en cada fotograma. Ocho paneles de eso en la misma sección. `<details>` no
 * pesa nada, funciona sin JavaScript, el navegador ya le da la semántica de
 * expandido/colapsado, y Ctrl+F encuentra el texto de dentro — cosa que con
 * un panel desmontado no pasa.
 */
export function HomeFaq() {
  const t = useT();
  const f = t.faq;

  return (
    <Section id="preguntas">
      <SectionHeader label={f.sectionLabel} title={f.heading} subtitle={f.subheading} />

      <Reveal className="mt-12 max-w-3xl">
        <ul className="border-t border-hairline">
          {f.items.map((item) => (
            <li key={item.q} className="border-b border-hairline">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[15.5px] font-medium text-foreground transition-colors hover:text-accent-green [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="pb-6 pr-8 text-[14.5px] leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
