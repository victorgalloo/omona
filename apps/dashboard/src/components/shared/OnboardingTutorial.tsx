'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Users,
  PhoneForwarded,
  Settings,
  FlaskConical,
  Globe,
  Bot,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

// ── Tutorial Steps ──────────────────────────────────────────────────

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string; // CSS selector to highlight
  targetNav?: string; // nav item href to highlight
  route?: string; // navigate here first
  position: 'center' | 'right' | 'left' | 'bottom';
  action?: string; // CTA button text
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Omona! 🚀',
    description:
      'Tu agente de ventas con IA para WhatsApp. Te guiaré paso a paso para configurar todo en menos de 5 minutos.',
    icon: Sparkles,
    position: 'center',
    action: 'Empezar',
  },
  {
    id: 'settings-business',
    title: '1. Configura tu negocio',
    description:
      'Primero, ve a Ajustes y agrega la info de tu negocio. Puedes pegar tu sitio web y Omona extrae todo automáticamente con IA.',
    icon: Globe,
    targetNav: '/settings',
    route: '/settings',
    position: 'right',
    action: 'Ir a Ajustes',
  },
  {
    id: 'settings-products',
    title: '2. Agrega tus productos',
    description:
      'En la pestaña "Productos", agrega lo que vendes con precios y descripciones. Omona usará esta info para responder a clientes.',
    icon: Settings,
    targetNav: '/settings',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'settings-agent',
    title: '3. Personaliza tu agente',
    description:
      'En "Agente" elige el tono (casual o profesional), modo de ventas y cuántas preguntas de calificación hacer antes de cerrar.',
    icon: Bot,
    targetNav: '/settings',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'settings-whatsapp',
    title: '4. Conecta WhatsApp',
    description:
      'En "WhatsApp", escanea el código QR con tu teléfono (WhatsApp → Dispositivos vinculados → Vincular). ¡Listo en 30 segundos!',
    icon: Smartphone,
    targetNav: '/settings',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'test',
    title: '5. Prueba tu agente',
    description:
      'Usa la página de Pruebas para chatear con tu agente y verificar que responde correctamente antes de ir en vivo.',
    icon: FlaskConical,
    targetNav: '/test',
    route: '/test',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'inbox',
    title: '6. Tu Inbox',
    description:
      'Aquí verás todas las conversaciones con clientes en tiempo real. Puedes intervenir cuando quieras y tomar el control del chat.',
    icon: MessageSquare,
    targetNav: '/inbox',
    route: '/inbox',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'leads',
    title: '7. Leads automáticos',
    description:
      'Omona califica a cada contacto automáticamente. Aquí verás el score, datos extraídos y el estado de cada lead.',
    icon: Users,
    targetNav: '/leads',
    route: '/leads',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'handoff',
    title: '8. Handoff a humanos',
    description:
      'Cuando un cliente necesita atención especial, Omona lo marca aquí para que tú o tu equipo tomen la conversación.',
    icon: PhoneForwarded,
    targetNav: '/handoff',
    route: '/handoff',
    position: 'right',
    action: 'Siguiente',
  },
  {
    id: 'done',
    title: '¡Todo listo! 🎉',
    description:
      'Ya conoces Omona. Empieza conectando WhatsApp en Ajustes y tu agente comenzará a vender 24/7. ¿Dudas? Escríbenos.',
    icon: Rocket,
    position: 'center',
    action: 'Comenzar a usar Omona',
  },
];

// ── Storage Key ──────────────────────────────────────────────────────

const STORAGE_KEY = 'omona_tutorial_completed';
const STORAGE_STEP_KEY = 'omona_tutorial_step';

// ── Spotlight Component ──────────────────────────────────────────────

function Spotlight({ selector }: { selector: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
    }
  }, [selector]);

  if (!rect) return null;

  return (
    <div
      className="absolute z-[9998] rounded-xl ring-4 ring-accent-green ring-offset-2 transition-all duration-500 pointer-events-none"
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      }}
    />
  );
}

// ── Nav Highlight ────────────────────────────────────────────────────

function NavHighlight({ href }: { href: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(`a[href="${href}"]`);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [href]);

  if (!rect) return null;

  return (
    <div
      className="absolute z-[9998] rounded-xl transition-all duration-500 pointer-events-none"
      style={{
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        boxShadow: '0 0 0 3px #25D366, 0 0 20px rgba(37, 211, 102, 0.4)',
      }}
    />
  );
}

// ── Tooltip Card ─────────────────────────────────────────────────────

function TooltipCard({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: {
  step: TutorialStep;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const Icon = step.icon;
  const isCenter = step.position === 'center';
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  return (
    <div
      className={`
        fixed z-[9999] w-[360px] max-w-[calc(100vw-2rem)]
        ${isCenter ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
        ${step.position === 'right' ? 'top-1/2 left-4 md:left-[92px] -translate-y-1/2' : ''}
        ${step.position === 'left' ? 'top-1/2 right-4 -translate-y-1/2' : ''}
        ${step.position === 'bottom' ? 'bottom-20 md:bottom-8 left-1/2 -translate-x-1/2' : ''}
      `}
    >
      <div className="rounded-2xl bg-background shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface-2 to-surface-2 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20">
                <Icon className="h-5 w-5 text-background" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-background">{step.title}</h3>
                <p className="text-xs text-background/70">
                  {currentIndex + 1} de {totalSteps}
                </p>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="flex h-7 w-7 items-center justify-center rounded-full text-background/60 hover:bg-background/20 hover:text-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-muted leading-relaxed">{step.description}</p>
        </div>

        {/* Progress bar */}
        <div className="px-5">
          <div className="h-1 w-full rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-accent-green transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
            )}
            {isFirst && (
              <button
                onClick={onSkip}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Saltar tutorial
              </button>
            )}
          </div>

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 rounded-full bg-accent-green px-5 py-2 text-sm font-medium text-background hover:bg-[#20BD5A] transition-colors shadow-sm"
          >
            {isLast ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {step.action}
              </>
            ) : (
              <>
                {step.action || 'Siguiente'}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* WhatsApp-style message tail for non-center positions */}
      {!isCenter && step.position === 'right' && (
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white" />
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export function OnboardingTutorial() {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = useCallback(() => {
    if (currentStep >= TUTORIAL_STEPS.length - 1) {
      // Done
      localStorage.setItem(STORAGE_KEY, 'true');
      setActive(false);
      router.push('/settings');
      return;
    }

    const nextStep = TUTORIAL_STEPS[currentStep + 1];
    if (nextStep.route && pathname !== nextStep.route) {
      router.push(nextStep.route);
    }
    setCurrentStep((s) => s + 1);
    localStorage.setItem(STORAGE_STEP_KEY, String(currentStep + 1));
  }, [currentStep, pathname, router]);

  const handlePrev = useCallback(() => {
    if (currentStep <= 0) return;
    const prevStep = TUTORIAL_STEPS[currentStep - 1];
    if (prevStep.route && pathname !== prevStep.route) {
      router.push(prevStep.route);
    }
    setCurrentStep((s) => s - 1);
    localStorage.setItem(STORAGE_STEP_KEY, String(currentStep - 1));
  }, [currentStep, pathname, router]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setActive(false);
  }, []);

  if (!mounted || !active) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9997] bg-black/50 transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Nav highlight */}
      {step.targetNav && <NavHighlight href={step.targetNav} />}

      {/* Target spotlight */}
      {step.target && <Spotlight selector={step.target} />}

      {/* Tooltip */}
      <TooltipCard
        step={step}
        currentIndex={currentStep}
        totalSteps={TUTORIAL_STEPS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
      />
    </>,
    document.body
  );
}

// ── Restart Button (for settings page) ──────────────────────────────

export function RestartTutorialButton() {
  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
    window.location.reload();
  };

  return (
    <button
      onClick={handleRestart}
      className="flex items-center gap-2 text-sm text-accent-green hover:underline"
    >
      <Sparkles className="h-4 w-4" />
      Repetir tutorial
    </button>
  );
}
