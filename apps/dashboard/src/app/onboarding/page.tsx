'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, Loader2, Plus, Trash2, ArrowRight, ArrowLeft,
  Bot, Sparkles, SendHorizontal, Check, MessageSquare,
  Briefcase, Package, Sliders, Zap, Smartphone,
} from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';
import { StepChooseChannel } from '@/components/onboarding/StepChooseChannel';

interface Product {
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface AgentConfig {
  business_name: string;
  business_description: string;
  industry: string;
  target_audience: string;
  products_services: Product[];
  faqs: FAQ[];
  tone: string;
  custom_personality: string;
  sales_mode: string;
  qualification_questions: number;
}

const STEPS = [
  { id: 'welcome', icon: Zap, title: 'Bienvenido' },
  { id: 'business', icon: Briefcase, title: 'Tu negocio' },
  { id: 'products', icon: Package, title: 'Productos' },
  { id: 'personality', icon: Sliders, title: 'Personalidad' },
  { id: 'channel', icon: Smartphone, title: 'Canal' },
  { id: 'test', icon: MessageSquare, title: 'Prueba' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [scraping, setScraping] = useState(false);

  const [config, setConfig] = useState<AgentConfig>({
    business_name: '',
    business_description: '',
    industry: '',
    target_audience: '',
    products_services: [],
    faqs: [],
    tone: 'casual',
    custom_personality: '',
    sales_mode: 'flexible',
    qualification_questions: 3,
  });

  // Config chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Test chat state
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [testInput, setTestInput] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testConvId, setTestConvId] = useState<string>();
  const testBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    testBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [testMessages]);

  const updateConfig = (updates: Partial<AgentConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Website scraping
  const handleScrape = async () => {
    if (!websiteUrl) return;
    setScraping(true);
    try {
      const res = await api.post<{ success: boolean; data: any }>('/api/onboarding/scrape-website', { url: websiteUrl });
      if (res.success && res.data) {
        updateConfig({
          business_name: res.data.business_name || config.business_name,
          business_description: res.data.business_description || config.business_description,
          industry: res.data.industry || config.industry,
          target_audience: res.data.target_audience || config.target_audience,
          products_services: res.data.products_services?.length ? res.data.products_services : config.products_services,
          faqs: res.data.faqs?.length ? res.data.faqs : config.faqs,
        });
        setStep(1); // Jump to business step
      }
    } catch (e: any) {
      alert(e.message || 'Error al analizar el sitio');
    } finally {
      setScraping(false);
    }
  };

  // Config chat
  const handleConfigChat = async () => {
    const text = chatInput.trim();
    if (!text || chatSending) return;
    setChatMessages((m) => [...m, { role: 'user', content: text }]);
    setChatInput('');
    setChatSending(true);
    try {
      const res = await api.post<{ reply: string; current_config: any; updates_applied: any }>('/api/onboarding/config-chat', {
        message: text,
        current_config: config,
      });
      setChatMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
      if (res.current_config) {
        setConfig((prev) => ({ ...prev, ...res.current_config }));
      }
    } catch {
      setChatMessages((m) => [...m, { role: 'assistant', content: 'Error de conexión.' }]);
    } finally {
      setChatSending(false);
    }
  };

  // Test chat  
  const handleTestChat = async () => {
    const text = testInput.trim();
    if (!text || testSending) return;
    setTestMessages((m) => [...m, { role: 'user', content: text }]);
    setTestInput('');
    setTestSending(true);
    try {
      const res = await api.post<{ reply: string; conversation_id: string }>('/api/test/chat', {
        message: text,
        conversation_id: testConvId,
      });
      setTestConvId(res.conversation_id);
      setTestMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
    } catch {
      setTestMessages((m) => [...m, { role: 'assistant', content: 'Error de conexión.' }]);
    } finally {
      setTestSending(false);
    }
  };

  // Save and finish
  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.post('/api/onboarding/save', config);
      posthog?.capture('onboarding_completed');
      // Server marks onboarding_completed=true in DB
      // Use replace so AuthGuard doesn't redirect back
      router.replace('/inbox');
    } catch {
      alert('Error al guardar');
      setLoading(false);
    }
  };

  // Product helpers
  const addProduct = () => updateConfig({
    products_services: [...config.products_services, { name: '', description: '', price: '', features: [] }],
  });
  const removeProduct = (i: number) => updateConfig({
    products_services: config.products_services.filter((_, idx) => idx !== i),
  });
  const updateProduct = (i: number, updates: Partial<Product>) => {
    const prods = [...config.products_services];
    prods[i] = { ...prods[i], ...updates };
    updateConfig({ products_services: prods });
  };

  return (
    <div className="flex h-screen flex-col bg-surface">
      {/* Progress bar */}
      <div className="bg-background border-b border-border">
        <div className="flex items-center justify-center gap-1 px-4 py-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => i <= step ? setStep(i) : null}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  i === step
                    ? 'bg-accent-green text-background'
                    : i < step
                    ? 'bg-foreground text-surface-2'
                    : 'bg-surface text-muted'
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 h-[2px] w-4 sm:w-8 ${i < step ? 'bg-accent-green' : 'bg-surface-2'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-green shadow-lg">
                  <Bot className="h-10 w-10 text-background" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Configura tu agente</h1>
                <p className="mt-2 text-sm text-muted">
                  En 2 minutos tendrás un agente de ventas inteligente listo para WhatsApp
                </p>
              </div>

              {/* Website import */}
              <div className="rounded-2xl bg-background p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-accent-green" />
                  <h2 className="font-semibold text-foreground">Importar desde tu sitio web</h2>
                </div>
                <p className="text-xs text-muted mb-3">
                  Analizamos tu sitio y extraemos tus productos, descripción y preguntas frecuentes automáticamente.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://tuempresa.com"
                    className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
                  />
                  <button
                    onClick={handleScrape}
                    disabled={!websiteUrl || scraping}
                    className="flex items-center gap-1.5 rounded-xl bg-accent-green px-4 py-2.5 text-sm font-medium text-background disabled:opacity-40"
                  >
                    {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {scraping ? 'Analizando...' : 'Importar'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">o configura manualmente</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full rounded-xl bg-background py-3.5 text-sm font-medium text-foreground shadow-sm hover:bg-surface transition-colors"
              >
                Configurar manualmente →
              </button>
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Sobre tu negocio</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted uppercase tracking-wide">Nombre del negocio</label>
                  <input value={config.business_name} onChange={(e) => updateConfig({ business_name: e.target.value })}
                    placeholder="Ej: TechSolutions México"
                    className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted uppercase tracking-wide">Descripción</label>
                  <textarea value={config.business_description} onChange={(e) => updateConfig({ business_description: e.target.value })}
                    placeholder="¿Qué hace tu empresa? (1-2 oraciones)"
                    rows={2}
                    className="mt-1 w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">Industria</label>
                    <input value={config.industry} onChange={(e) => updateConfig({ industry: e.target.value })}
                      placeholder="Ej: SaaS, E-commerce"
                      className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted uppercase tracking-wide">Público objetivo</label>
                    <input value={config.target_audience} onChange={(e) => updateConfig({ target_audience: e.target.value })}
                      placeholder="Ej: PyMEs en México"
                      className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Products */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Productos y servicios</h2>
                <button onClick={addProduct} className="flex items-center gap-1 rounded-lg bg-accent-green px-3 py-1.5 text-xs font-medium text-background">
                  <Plus className="h-3.5 w-3.5" /> Agregar
                </button>
              </div>
              {config.products_services.length === 0 && (
                <div className="rounded-2xl bg-background p-6 text-center shadow-sm">
                  <Package className="mx-auto mb-2 h-10 w-10 text-muted/30" />
                  <p className="text-sm text-muted">Agrega tus productos o servicios para que el agente pueda venderlos</p>
                </div>
              )}
              {config.products_services.map((p, i) => (
                <div key={i} className="rounded-2xl bg-background p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-accent-green">Producto {i + 1}</span>
                    <button onClick={() => removeProduct(i)} className="text-red-400 hover:text-error"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <input value={p.name} onChange={(e) => updateProduct(i, { name: e.target.value })} placeholder="Nombre"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent-green focus:outline-none" />
                  <textarea value={p.description} onChange={(e) => updateProduct(i, { description: e.target.value })} placeholder="Descripción" rows={2}
                    className="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-accent-green focus:outline-none" />
                  <input value={p.price} onChange={(e) => updateProduct(i, { price: e.target.value })} placeholder="Precio (ej: $999/mes)"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent-green focus:outline-none" />
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Personality */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Personalidad del agente</h2>
              
              {/* Tone */}
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wide">Tono</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { value: 'casual', label: '😎 Casual', desc: 'Amigable y relajado' },
                    { value: 'professional', label: '👔 Profesional', desc: 'Formal y serio' },
                    { value: 'custom', label: '✨ Custom', desc: 'Tú defines' },
                  ].map((t) => (
                    <button key={t.value} onClick={() => updateConfig({ tone: t.value })}
                      className={`rounded-xl p-3 text-left transition-all ${config.tone === t.value ? 'bg-foreground border-2 border-accent-green' : 'bg-background border-2 border-transparent shadow-sm'}`}>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {config.tone === 'custom' && (
                <div>
                  <label className="text-xs font-medium text-muted uppercase tracking-wide">Instrucciones de personalidad</label>
                  <textarea value={config.custom_personality} onChange={(e) => updateConfig({ custom_personality: e.target.value })}
                    placeholder="Ej: Habla como un vendedor de autos premium, usa analogías deportivas, sé entusiasta pero no exagerado..."
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                </div>
              )}

              {/* Sales mode */}
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wide">Objetivo de ventas</label>
                <div className="mt-2 space-y-2">
                  {[
                    { value: 'schedule_demo', label: '📅 Agendar demos', desc: 'El agente busca agendar una llamada o reunión' },
                    { value: 'direct_close', label: '💳 Venta directa', desc: 'Cierra la venta por WhatsApp' },
                    { value: 'lead_capture', label: '📋 Capturar leads', desc: 'Obtiene datos de contacto y alguien les da seguimiento' },
                    { value: 'flexible', label: '🎯 Flexible', desc: 'Se adapta según la conversación' },
                  ].map((m) => (
                    <button key={m.value} onClick={() => updateConfig({ sales_mode: m.value })}
                      className={`w-full rounded-xl p-3 text-left transition-all ${config.sales_mode === m.value ? 'bg-foreground border-2 border-accent-green' : 'bg-background border-2 border-transparent shadow-sm'}`}>
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Config via chat */}
              <div className="rounded-2xl bg-background shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b px-4 py-2.5 bg-surface-2">
                  <Sparkles className="h-4 w-4 text-accent-green" />
                  <span className="text-sm font-medium text-background">Configura por chat</span>
                </div>
                <div className="h-48 overflow-y-auto p-3 space-y-2 bg-background">
                  {chatMessages.length === 0 && (
                    <p className="text-center text-xs text-muted mt-4">
                      Dile al asistente cómo quieres que se comporte tu agente
                    </p>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow-sm ${m.role === 'user' ? 'bg-foreground' : 'bg-background'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {chatSending && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-background px-3 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>
                <div className="flex gap-2 p-2 bg-surface">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfigChat()}
                    placeholder="Ej: Quiero que sea más directo y use emojis..."
                    className="flex-1 rounded-full border-0 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-green" />
                  <button onClick={handleConfigChat} disabled={chatSending || !chatInput.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green text-background disabled:opacity-40">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Test */}
          {step === 4 && (
            <StepChooseChannel onConnected={() => setStep(5)} />
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">¡Prueba tu agente!</h2>
                <p className="text-sm text-muted">Chatea con tu bot como si fueras un cliente</p>
              </div>
              <div className="rounded-2xl bg-background shadow-sm overflow-hidden">
                <div className="flex items-center gap-2.5 bg-surface-2 px-4 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green">
                    <Bot className="h-4 w-4 text-background" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-background">{config.business_name || 'Tu Agente'}</p>
                    <p className="text-[10px] text-background/70">Modo de prueba</p>
                  </div>
                </div>
                <div className="h-64 overflow-y-auto p-3 space-y-2 bg-background">
                  {testMessages.length === 0 && (
                    <p className="text-center text-xs text-muted mt-8">Envía un mensaje para probar</p>
                  )}
                  {testMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow-sm ${m.role === 'user' ? 'bg-foreground' : 'bg-background'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {testSending && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-background px-3 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={testBottomRef} />
                </div>
                <div className="flex gap-2 p-2 bg-surface">
                  <input value={testInput} onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestChat()}
                    placeholder="Escribe como cliente..."
                    className="flex-1 rounded-full border-0 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-green" />
                  <button onClick={handleTestChat} disabled={testSending || !testInput.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green text-background disabled:opacity-40">
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
          ) : <div />}
          
          {step < STEPS.length - 1 ? (
            <button onClick={() => {
              posthog?.capture('onboarding_step_completed', { step, step_name: STEPS[step].id });
              setStep(step + 1);
            }}
              className="flex items-center gap-1.5 rounded-xl bg-accent-green px-5 py-2.5 text-sm font-medium text-background hover:bg-surface-2 transition-colors">
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-accent-green px-5 py-2.5 text-sm font-medium text-background hover:bg-surface-2 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {loading ? 'Guardando...' : '¡Listo! Activar agente'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
