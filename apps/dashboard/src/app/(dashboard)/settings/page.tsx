'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/shared/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BusinessSettings } from '@/components/settings/BusinessSettings';
import { AgentSettings } from '@/components/settings/AgentSettings';
import { WhatsAppSettings } from '@/components/settings/WhatsAppSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { QuickRepliesSettings } from '@/components/settings/QuickRepliesSettings';
import { WebhookSettings } from '@/components/settings/WebhookSettings';
import { CalendarSettings } from '@/components/settings/CalendarSettings';
import { TeamSettings } from '@/components/settings/TeamSettings';
import { PlanSettings } from '@/components/settings/PlanSettings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { RestartTutorialButton } from '@/components/shared/OnboardingTutorial';

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

function ProductsSettings() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ agent_config: { products_services: Product[] } }>('/api/settings').then((res) => {
      setProducts(res.agent_config.products_services ?? []);
    }).catch(() => { });
  }, []);

  const addProduct = () =>
    setProducts((p) => [...p, { name: '', description: '', price: '', features: [] }]);

  const removeProduct = (i: number) =>
    setProducts((p) => p.filter((_, idx) => idx !== i));

  const updateProduct = (i: number, field: keyof Product, value: string | string[]) =>
    setProducts((p) => p.map((prod, idx) => (idx === i ? { ...prod, [field]: value } : prod)));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/settings/agent', { products_services: products });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Cambios guardados');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [products]);

  return (
    <div className="space-y-4">
      {products.map((product, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Producto {i + 1}</span>
            <button onClick={() => removeProduct(i)} className="text-muted hover:text-error">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nombre</Label>
              <Input
                value={product.name}
                onChange={(e) => updateProduct(i, 'name', e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Descripción</Label>
              <Textarea
                value={product.description}
                onChange={(e) => updateProduct(i, 'description', e.target.value)}
                className="mt-1 text-sm"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs">Precio</Label>
              <Input
                value={product.price}
                onChange={(e) => updateProduct(i, 'price', e.target.value)}
                placeholder="ej. $999 MXN/mes"
                className="mt-1 h-9 text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addProduct}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Agregar producto
      </Button>

      <Separator />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {saved ? '¡Guardado!' : 'Guardar cambios'}
      </Button>
    </div>
  );
}

function FAQSettings() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ agent_config: { faqs: FAQ[] } }>('/api/settings').then((res) => {
      setFaqs(res.agent_config.faqs ?? []);
    }).catch(() => { });
  }, []);

  const addFaq = () => setFaqs((f) => [...f, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaqs((f) => f.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: keyof FAQ, value: string) =>
    setFaqs((f) => f.map((faq, idx) => (idx === i ? { ...faq, [field]: value } : faq)));

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/settings/agent', { faqs });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Cambios guardados');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [faqs]);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Pregunta {i + 1}</span>
            <button onClick={() => removeFaq(i)} className="text-muted hover:text-error">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Pregunta</Label>
              <Input
                value={faq.question}
                onChange={(e) => updateFaq(i, 'question', e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Respuesta</Label>
              <Textarea
                value={faq.answer}
                onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                className="mt-1 text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addFaq}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Agregar pregunta
      </Button>

      <Separator />

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {saved ? '¡Guardado!' : 'Guardar cambios'}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Ajustes" />
      <div className="flex justify-end px-6 pt-2">
        <RestartTutorialButton />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <Tabs defaultValue="business">
            <TabsList className="mb-6 w-full overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="business">Negocio</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="faqs">Preguntas frecuentes</TabsTrigger>
              <TabsTrigger value="agent">Agente</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="quick-replies">Respuestas rápidas</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="plan">
              <PlanSettings />
            </TabsContent>

            <TabsContent value="business">
              <BusinessSettings />
            </TabsContent>

            <TabsContent value="products">
              <ProductsSettings />
            </TabsContent>

            <TabsContent value="faqs">
              <FAQSettings />
            </TabsContent>

            <TabsContent value="agent">
              <AgentSettings />
            </TabsContent>

            <TabsContent value="whatsapp">
              <WhatsAppSettings />
            </TabsContent>

            <TabsContent value="quick-replies">
              <QuickRepliesSettings />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="team">
              <TeamSettings />
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarSettings />
            </TabsContent>

            <TabsContent value="webhooks">
              <WebhookSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
