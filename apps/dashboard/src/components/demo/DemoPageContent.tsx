'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot, SendHorizontal, RotateCcw, ArrowRight, Sparkles,
  Zap, MessageSquare, Users, BarChart3, X, Loader2, Eye, EyeOff,
  Mail, CheckCircle2,
} from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  '¿Qué es Omona?',
  '¿Cuánto cuesta?',
  '¿Cómo funciona?',
  'Quiero una demo',
];

const FEATURES = [
  { icon: Zap, title: 'Setup en 2 min', desc: 'Escanea un QR y tu agente está listo' },
  { icon: MessageSquare, title: 'IA conversacional', desc: 'Ventas naturales, no un chatbot rígido' },
  { icon: Users, title: 'Lead scoring', desc: 'Califica leads automáticamente' },
  { icon: BarChart3, title: 'Dashboard', desc: 'Ve todas tus conversaciones en tiempo real' },
];

export function DemoPageContent() {
  const router = useRouter();
  const posthog = usePostHog();
  const { user, signIn, signUp } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string>();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) router.push('/inbox');
  }, [user, router]);

  // Promo notification — show after 8s, or after 2nd message
  useEffect(() => {
    if (promoDismissed) return;
    const timer = setTimeout(() => setShowPromo(true), 8000);
    return () => clearTimeout(timer);
  }, [promoDismissed]);

  useEffect(() => {
    if (messages.filter(m => m.role === 'user').length >= 2 && !promoDismissed) {
      setShowPromo(true);
    }
  }, [messages, promoDismissed]);

  // Auto greeting + track demo_started
  useEffect(() => {
    posthog?.capture('demo_started');
    const timer = setTimeout(() => {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: '¡Hola! 👋 Soy un agente de ventas creado con Omona. Pregúntame lo que quieras — así es como tus clientes te van a escribir por WhatsApp.',
      }]);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sending) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', content: text.trim() }]);
    setInput('');
    setSending(true);
    try {
      const res = await api.post<{ reply: string; conversation_id: string }>('/api/test/demo', {
        message: text.trim(),
        conversation_id: convId,
      });
      setConvId(res.conversation_id);
      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: 'assistant', content: res.reply }]);
    } catch {
      setMessages((m) => [...m, { id: `e-${Date.now()}`, role: 'assistant', content: 'Error de conexión.' }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [sending, convId]);

  const handleReset = () => {
    setMessages([{
      id: 'greeting', role: 'assistant',
      content: '¡Hola! 👋 Pregúntame lo que quieras sobre Omona.',
    }]);
    setConvId(undefined);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword);
        posthog?.capture('signed_in', { method: 'email' });
        router.push('/onboarding');
      } else {
        await signUp(authEmail, authPassword, authName);
        posthog?.capture('signed_up', { method: 'email' });
        setConfirmationSent(true);
      }
    } catch (err: any) {
      const msg = err.message || 'Error de autenticación';
      setAuthError(msg === 'Failed to fetch' ? 'Error de conexión. Verifica tu internet e intenta de nuevo.' : msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1 && !sending;

  return (
    <div className="flex h-screen flex-col bg-background">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green">
            <Bot className="h-4 w-4 text-background" />
          </div>
          <span className="text-lg font-bold text-foreground">Omona</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAuthMode('login'); setShowAuth(true); }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
            className="rounded-lg bg-accent-green px-4 py-2 text-sm font-medium text-background hover:bg-surface-2 transition-colors"
          >
            Crear cuenta gratis
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left side — Hero + Features (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-12 xl:px-16">
          <div className="max-w-md">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-surface-2">
              <Sparkles className="h-3 w-3" />
              Agente de ventas con IA
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground xl:text-5xl">
              Tu vendedor en WhatsApp.
              <br />
              <span className="text-accent-green">24/7.</span>
            </h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Conecta tu WhatsApp, configura tus productos y deja que la IA responda, califique leads y cierre ventas automáticamente.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl bg-surface p-3">
                  <f.icon className="mb-1.5 h-5 w-5 text-accent-green" />
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-muted">{f.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
              className="mt-8 flex items-center gap-2 rounded-xl bg-accent-green px-6 py-3 text-base font-semibold text-background shadow-lg shadow-accent-green/25 hover:bg-surface-2 transition-all"
            >
              Empieza gratis <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-2 text-xs text-muted">No necesitas tarjeta de crédito</p>
          </div>
        </div>

        {/* Right side — Demo chat (always visible) */}
        <div className="flex flex-1 flex-col lg:w-[55%] lg:py-6 lg:pr-8">

          {/* Mobile hero (visible only on small screens) */}
          <div className="lg:hidden bg-gradient-to-b from-surface-2 to-surface-2 px-4 py-5 text-center">
            <h1 className="text-xl font-bold text-background">Tu vendedor en WhatsApp. <span className="text-foreground">24/7.</span></h1>
            <p className="mt-1 text-sm text-background/80">Prueba el demo — así atiende a tus clientes</p>
          </div>

          {/* Chat container */}
          <div className="flex flex-1 flex-col overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:shadow-2xl">

            {/* Chat header */}
            <div className="flex items-center justify-between bg-surface-2 px-4 py-2.5 lg:rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green">
                  <Bot className="h-4 w-4 text-background" />
                </div>
                <div>
                  <p className="text-sm font-medium text-background">Omona Demo</p>
                  <p className="text-[10px] text-background/60 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> en línea
                  </p>
                </div>
              </div>
              <button onClick={handleReset} className="rounded-full p-2 text-background/50 hover:bg-background/10 hover:text-background">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Demo badge */}
            <div className="bg-[#FCF4CB]/80 px-3 py-1.5 text-center">
              <p className="text-[10px] text-[#54656F]">
                Demo interactivo — así chatean tus clientes con tu agente
              </p>
            </div>

            {/* Messages */}
            <div className="bg-background flex-1 overflow-y-auto px-3 py-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex mb-1.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[85%] rounded-lg px-3 py-2 text-[14px] leading-[19px] shadow-sm ${msg.role === 'user' ? 'bg-foreground' : 'bg-background'}`}>
                    <p className="whitespace-pre-wrap break-words text-foreground">{msg.content}</p>
                    <span className="mt-0.5 flex justify-end text-[10px] text-muted">
                      {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start mb-1.5">
                  <div className="rounded-lg bg-background px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              {showSuggestions && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="rounded-full border border-accent-green/50 bg-background px-3 py-1.5 text-xs font-medium text-surface-2 shadow-sm hover:bg-foreground transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* CTA in chat */}
            {messages.length >= 3 && (
              <div className="bg-gradient-to-r from-surface-2 to-surface-2 px-3 py-2">
                <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-background py-2.5 text-sm font-semibold text-surface-2 shadow-sm hover:bg-surface transition-colors">
                  Crea tu agente gratis <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Chat input */}
            <div className="flex items-center gap-2 bg-surface px-2 py-2 lg:rounded-b-2xl">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Escribe un mensaje..." disabled={sending}
                className="flex-1 rounded-full bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-green" />
              <button onClick={() => sendMessage(input)} disabled={sending || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-green text-background active:scale-95 transition-all disabled:opacity-40">
                <SendHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile CTA below chat */}
          <div className="lg:hidden px-4 py-3 bg-background border-t border-border">
            <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-background shadow-lg shadow-accent-green/25 hover:bg-surface-2 transition-all">
              Crea tu agente gratis <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Promo Notification Toast */}
      {showPromo && !promoDismissed && !showAuth && (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm animate-in slide-in-from-bottom fade-in duration-500 md:left-auto md:right-6 md:bottom-6">
          <div className="relative overflow-hidden rounded-2xl bg-background shadow-2xl border border-border">
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-accent-green to-surface-2" />
            <button onClick={() => { setShowPromo(false); setPromoDismissed(true); }}
              className="absolute right-2 top-3 rounded-full p-1 text-muted hover:bg-surface">
              <X className="h-4 w-4" />
            </button>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground">
                  <Sparkles className="h-5 w-5 text-surface-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">
                    14 días gratis
                  </p>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">
                    Prueba Omona con tu propio WhatsApp. Sin tarjeta, sin compromiso.
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowPromo(false); setPromoDismissed(true); setAuthMode('signup'); setShowAuth(true); }}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent-green py-2.5 text-sm font-semibold text-background hover:bg-surface-2 transition-colors"
              >
                Empezar trial gratis <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAuth(false)}>
          <div className="relative w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button onClick={() => { setShowAuth(false); setConfirmationSent(false); setAuthError(''); }}
              className="absolute right-4 top-4 rounded-full p-1 text-muted hover:bg-surface hover:text-foreground">
              <X className="h-5 w-5" />
            </button>

            {confirmationSent ? (
              /* ── Email Confirmation Screen ── */
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
                  <Mail className="h-8 w-8 text-surface-2" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Revisa tu correo</h2>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Enviamos un enlace de confirmación a
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{authEmail}</p>
                <div className="mt-5 rounded-xl bg-surface p-4">
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Haz clic en el enlace del correo</p>
                      <p className="mt-0.5 text-xs text-muted">Esto confirma tu cuenta y te redirige al dashboard</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted">
                  ¿No lo ves? Revisa tu carpeta de spam
                </p>
                <button onClick={() => { setConfirmationSent(false); setAuthMode('login'); }}
                  className="mt-4 text-sm font-medium text-accent-green hover:underline">
                  Ya confirmé, iniciar sesión →
                </button>
              </div>
            ) : (
              /* ── Login / Signup Form ── */
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green">
                    <Bot className="h-6 w-6 text-background" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {authMode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu agente'}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {authMode === 'login' ? 'Inicia sesión en tu cuenta' : 'Empieza a vender por WhatsApp en 2 minutos'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-3">
                  {authMode === 'signup' && (
                    <div>
                      <label className="text-xs font-medium text-muted">Nombre</label>
                      <input value={authName} onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Tu nombre" required={authMode === 'signup'}
                        className="mt-1 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted">Correo electrónico</label>
                    <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="tu@empresa.com" required
                      className="mt-1 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Contraseña</label>
                    <div className="relative mt-1">
                      <input type={showPassword ? 'text' : 'password'} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder={authMode === 'signup' ? 'Mínimo 6 caracteres' : 'Tu contraseña'} required minLength={6}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 pr-10 text-sm focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <p className="rounded-lg bg-error-muted px-3 py-2 text-xs text-error">{authError}</p>
                  )}

                  <button type="submit" disabled={authLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-background hover:bg-surface-2 transition-colors disabled:opacity-50">
                    {authLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta gratis'}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-muted">
                  {authMode === 'login' ? (
                    <>¿No tienes cuenta? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="font-semibold text-accent-green hover:underline">Regístrate</button></>
                  ) : (
                    <>¿Ya tienes cuenta? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="font-semibold text-accent-green hover:underline">Inicia sesión</button></>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
