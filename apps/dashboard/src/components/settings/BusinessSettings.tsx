'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Globe, Sparkles, CheckCircle2, AlertCircle, Package, HelpCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface AgentConfig {
  business_name: string;
  business_description: string | null;
  industry: string | null;
  target_audience: string | null;
  website_url: string | null;
}

interface ScrapeResult {
  business_name: string;
  business_description: string;
  industry: string;
  target_audience: string;
  contact_email: string;
  contact_phone: string;
  products_services: { name: string; description: string; price: string; category: string }[];
  faqs: { question: string; answer: string }[];
  unique_selling_points: string[];
  social_links: Record<string, string>;
}

const industries = [
  'Tecnología', 'E-commerce', 'Servicios profesionales', 'Salud',
  'Educación', 'Inmobiliaria', 'Restaurantes / Alimentos', 'Automotriz',
  'Finanzas', 'Marketing / Publicidad', 'Manufactura', 'Otro',
];

export function BusinessSettings() {
  const [form, setForm] = useState<AgentConfig>({
    business_name: '',
    business_description: '',
    industry: '',
    target_audience: '',
    website_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScrapeResult | null>(null);
  const [scanError, setScanError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ScrapeResult | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    api.get<{ agent_config: AgentConfig }>('/api/settings').then((res) => {
      setForm({
        business_name: res.agent_config.business_name ?? '',
        business_description: res.agent_config.business_description ?? '',
        industry: res.agent_config.industry ?? '',
        target_audience: res.agent_config.target_audience ?? '',
        website_url: res.agent_config.website_url ?? '',
      });
    }).catch(() => {});
  }, []);

  const handleScan = useCallback(async () => {
    if (!form.website_url) return;
    setScanning(true);
    setScanError('');
    setScanResult(null);
    try {
      const res = await api.post<{ success: boolean; data: ScrapeResult; error?: string }>(
        '/api/onboarding/scrape-website',
        { url: form.website_url }
      );
      if (res.data) {
        setScanResult(res.data);
        // Auto-fill form with extracted data
        setForm((f) => ({
          ...f,
          business_name: res.data.business_name || f.business_name,
          business_description: res.data.business_description || f.business_description,
          industry: res.data.industry || f.industry,
          target_audience: res.data.target_audience || f.target_audience,
        }));
      }
      if (res.error) setScanError(res.error);
    } catch (err: any) {
      setScanError(err.message || 'Error al escanear el sitio');
    } finally {
      setScanning(false);
    }
  }, [form.website_url]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError('');
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = (await (await import('@/lib/supabase')).supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/upload-document`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al procesar');
      if (json.data) {
        setUploadResult(json.data);
        setForm((f) => ({
          ...f,
          business_name: json.data.business_name || f.business_name,
          business_description: json.data.business_description || f.business_description,
          industry: json.data.industry || f.industry,
          target_audience: json.data.target_audience || f.target_audience,
        }));
        toast.success(`${json.data.products_services?.length || 0} productos extraídos de ${file.name}`);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error al procesar el documento');
      toast.error('Error al procesar documento');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put('/api/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Cambios guardados');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }, [form]);

  return (
    <div className="space-y-5">
      {/* Website Scanner — hero section */}
      <div className="rounded-xl border-2 border-dashed border-accent-green/40 bg-gradient-to-br from-foreground/30 to-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Configuración inteligente con IA</h3>
            <p className="text-xs text-muted">Pega tu sitio web y extraemos todo automáticamente</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={form.website_url ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
              placeholder="https://tu-negocio.com"
              className="pl-9"
            />
          </div>
          <Button
            onClick={handleScan}
            disabled={scanning || !form.website_url}
            className="bg-accent-green hover:bg-[#20BD5A] text-background shrink-0 w-full sm:w-auto"
          >
            {scanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Escanear sitio
              </>
            )}
          </Button>
        </div>

        {scanning && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-accent-green" />
            <p className="text-xs text-muted">
              Escaneando páginas, extrayendo productos, precios y más... esto puede tomar ~30 segundos
            </p>
          </div>
        )}

        {scanError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-error-muted px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-error" />
            <p className="text-xs text-error">{scanError}</p>
          </div>
        )}

        {scanResult && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-surface-2" />
              <p className="text-xs font-medium text-surface-2">
                ¡Listo! Datos del negocio extraídos y guardados automáticamente
              </p>
            </div>

            {/* Quick summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scanResult.products_services?.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
                  <Package className="h-4 w-4 text-accent-green" />
                  <span className="text-xs text-muted">
                    <strong className="text-foreground">{scanResult.products_services.length}</strong> productos encontrados
                  </span>
                </div>
              )}
              {scanResult.faqs?.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
                  <HelpCircle className="h-4 w-4 text-accent-green" />
                  <span className="text-xs text-muted">
                    <strong className="text-foreground">{scanResult.faqs.length}</strong> FAQs generadas
                  </span>
                </div>
              )}
            </div>

            {/* Products preview */}
            {scanResult.products_services?.length > 0 && (
              <div className="border-t border-border p-3">
                <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Productos detectados</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {scanResult.products_services.slice(0, 8).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground truncate flex-1">{p.name}</span>
                      {p.price && (
                        <span className="ml-2 shrink-0 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-surface-2">
                          {p.price}
                        </span>
                      )}
                    </div>
                  ))}
                  {scanResult.products_services.length > 8 && (
                    <p className="text-[10px] text-muted">
                      +{scanResult.products_services.length - 8} más...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* USPs */}
            {scanResult.unique_selling_points?.length > 0 && (
              <div className="border-t border-border p-3">
                <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Puntos de venta únicos</p>
                <ul className="space-y-1">
                  {scanResult.unique_selling_points.map((usp, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-accent-green" />
                      {usp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="rounded-xl border-2 border-dashed border-blue-300/60 bg-gradient-to-br from-blue-50/40 to-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info">
            <FileText className="h-4 w-4 text-background" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Subir documento</h3>
            <p className="text-xs text-muted">
              Sube un catálogo, lista de precios o brochure (PDF, DOCX, TXT — máx 10MB)
            </p>
          </div>
        </div>

        <label
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors ${
            uploading ? 'border-blue-300 bg-info-muted/50' : 'border-border hover:border-blue-400 hover:bg-info-muted/30'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-info" />
              <p className="text-xs text-muted">Extrayendo datos con IA... esto puede tomar ~30 segundos</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted" />
              <p className="text-sm font-medium text-foreground">Click para subir archivo</p>
              <p className="text-xs text-muted">PDF, DOCX o TXT</p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.csv,.md"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
        </label>

        {uploadError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-error-muted px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-error" />
            <p className="text-xs text-error">{uploadError}</p>
          </div>
        )}

        {uploadResult && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-surface-2" />
              <p className="text-xs font-medium text-surface-2">
                ¡Documento procesado! {uploadResult.products_services?.length || 0} productos y {uploadResult.faqs?.length || 0} FAQs extraídos
              </p>
            </div>

            {uploadResult.products_services?.length > 0 && (
              <div className="border-t border-border p-3">
                <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">Productos del documento</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {uploadResult.products_services.slice(0, 10).map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground truncate flex-1">{p.name}</span>
                      {p.price && (
                        <span className="ml-2 shrink-0 rounded-full bg-info-muted px-2 py-0.5 text-[10px] font-medium text-info">
                          {p.price}
                        </span>
                      )}
                    </div>
                  ))}
                  {uploadResult.products_services.length > 10 && (
                    <p className="text-[10px] text-muted">
                      +{uploadResult.products_services.length - 10} más...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form fields */}
      <div>
        <Label htmlFor="bname">Nombre del negocio</Label>
        <Input
          id="bname"
          value={form.business_name}
          onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="bdesc">Descripción</Label>
        <Textarea
          id="bdesc"
          value={form.business_description ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, business_description: e.target.value }))}
          className="mt-1.5"
          rows={3}
        />
      </div>

      <div>
        <Label>Industria</Label>
        <Select
          value={form.industry ?? ''}
          onValueChange={(v) => setForm((f) => ({ ...f, industry: v }))}
          placeholder="Selecciona una industria"
        >
          {industries.map((ind) => (
            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="audience">Público objetivo</Label>
        <Input
          id="audience"
          value={form.target_audience ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, target_audience: e.target.value }))}
          className="mt-1.5"
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="mt-4">
        {saving ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {saved ? '¡Guardado!' : 'Guardar cambios'}
      </Button>
    </div>
  );
}
