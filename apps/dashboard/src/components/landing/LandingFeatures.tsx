'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Brain, Calendar, RefreshCw, Target, Users, TrendingUp } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';

type LucideIcon = React.ComponentType<{ className?: string }>;

const ICONS: LucideIcon[] = [Brain, Calendar, RefreshCw, Target, Users, TrendingUp];

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  tech: string;
};

function FeatureRow({ feature, index }: { feature: FeatureItem; index: number }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({ target: mounted ? ref : undefined, offset: ['start end', 'center center'] });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const xLeft  = useTransform(scrollYProgress, [0, 0.5], [-80, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="min-h-[40vh] flex items-center py-16 border-b border-border/50 last:border-0"
    >
      <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Number + icon */}
        <motion.div
          style={{ x: isEven ? xLeft : xRight }}
          className={`flex items-center gap-8 ${!isEven ? 'lg:order-2 lg:justify-end' : ''}`}
        >
          <span className="text-[100px] lg:text-[140px] font-black leading-none font-mono select-none text-surface">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0">
            <feature.icon className="w-10 h-10 text-foreground" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          style={{ x: isEven ? xRight : xLeft }}
          className={!isEven ? 'lg:order-1 lg:text-right' : ''}
        >
          <p className="text-muted font-mono text-sm mb-2">{feature.tech}</p>
          <h3 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            .{feature.title}
          </h3>
          <p className="text-xl text-muted mb-4">{feature.subtitle}</p>
          <p className="text-muted leading-relaxed max-w-lg text-base">
            {feature.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LandingFeatures() {
  const t = useT();
  const features: FeatureItem[] = t.features.items.map((item, i) => ({
    ...item,
    icon: ICONS[i],
  }));

  return (
    <section id="features" className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted text-sm font-mono mb-4"
          >
            {t.features.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6"
          >
            {t.features.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            {t.features.subheading}
          </motion.p>
        </div>

        {/* Feature rows */}
        {features.map((feature, index) => (
          <FeatureRow key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
