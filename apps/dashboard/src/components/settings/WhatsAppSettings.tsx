'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Smartphone, CheckCircle2, XCircle, RefreshCw, Loader2, AlertTriangle, QrCode, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface WAStatus {
  status: string;
  phone_number: string | null;
  qr_code: string | null;
}

export function WhatsAppSettings() {
  const [status, setStatus] = useState<WAStatus>({ status: 'disconnected', phone_number: null, qr_code: null });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get<WAStatus>('/api/whatsapp/status');
      setStatus(res);
      return res;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Poll while connecting/qr_pending
  useEffect(() => {
    if (status.status === 'connecting' || status.status === 'qr_pending' || connecting) {
      pollRef.current = setInterval(fetchStatus, 2000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [status.status, connecting, fetchStatus]);

  // Stop connecting state when we get a final status
  useEffect(() => {
    if (status.status === 'connected' || status.status === 'disconnected' || status.status === 'error') {
      setConnecting(false);
    }
  }, [status.status]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post('/api/whatsapp/connect');
      toast.success('Conectando...');
    } catch {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post('/api/whatsapp/disconnect');
      fetchStatus();
    } catch {}
  };

  const handleReset = async () => {
    if (!confirm('¿Seguro que quieres resetear la sesión de WhatsApp? Tendrás que volver a escanear el QR.')) return;
    try {
      await api.post('/api/whatsapp/reset');
      setStatus({ status: 'disconnected', phone_number: null, qr_code: null });
      setConnecting(false);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-accent-green" />
      </div>
    );
  }

  const isConnected = status.status === 'connected';
  const isConnecting = status.status === 'connecting' || status.status === 'qr_pending' || connecting;
  const hasQR = !!status.qr_code;

  return (
    <div className="space-y-6">
      {/* Status card */}
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isConnected ? 'bg-foreground' : isConnecting ? 'bg-warning-muted' : 'bg-surface'
          }`}>
            <Smartphone className={`h-6 w-6 ${
              isConnected ? 'text-accent-green' : isConnecting ? 'text-yellow-600' : 'text-muted'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">WhatsApp</h3>
              {isConnected && <Badge variant="success">Conectado</Badge>}
              {isConnecting && (
                <Badge variant="outline" className="border-yellow-300 text-warning bg-warning-muted">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {hasQR ? 'Esperando escaneo' : 'Conectando...'}
                </Badge>
              )}
              {!isConnected && !isConnecting && (
                <Badge variant="error">Desconectado</Badge>
              )}
            </div>
            {status.phone_number && (
              <p className="text-sm text-muted mt-0.5">{status.phone_number}</p>
            )}
          </div>
          <div>
            <div className="flex gap-2">
              {isConnected ? (
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Desconectar
                </Button>
              ) : !isConnecting ? (
                <Button size="sm" onClick={handleConnect}>
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Conectar
                </Button>
              ) : null}
              {(isConnected || isConnecting || status.status === 'error') && (
                <Button variant="ghost" size="sm" onClick={handleReset} title="Resetear sesión">
                  <RotateCcw className="h-4 w-4 text-error" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      {isConnecting && (
        <div className="rounded-lg border border-border p-6">
          <div className="flex flex-col items-center gap-4">
            {hasQR ? (
              <>
                <div className="rounded-2xl border-2 border-accent-green bg-background p-4 shadow-lg">
                  <img
                    src={status.qr_code!.startsWith('data:') ? status.qr_code! : `data:image/png;base64,${status.qr_code}`}
                    alt="QR Code"
                    className="h-56 w-56"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Escanea el código QR</h3>
                  <p className="mt-1 text-sm text-muted max-w-xs">
                    Abre WhatsApp en tu celular → <strong>Dispositivos vinculados</strong> → <strong>Vincular dispositivo</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-green" />
                    <p className="mt-2 text-xs text-muted">Generando QR...</p>
                  </div>
                </div>
                <p className="text-sm text-muted">Conectando con WhatsApp...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Connected info */}
      {isConnected && (
        <div className="rounded-lg border border-foreground bg-foreground/20 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent-green" />
            <div>
              <p className="text-sm font-medium text-foreground">Tu WhatsApp está activo</p>
              <p className="mt-0.5 text-xs text-muted">
                Los mensajes entrantes serán procesados por Omona automáticamente.
                Puedes tomar control de cualquier conversación desde el inbox.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {status.status === 'error' && (
        <div className="rounded-lg border border-error/20 bg-error-muted p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-error" />
            <div>
              <p className="text-sm font-medium text-red-800">Error de conexión</p>
              <p className="mt-0.5 text-xs text-error">
                No se pudo conectar con WhatsApp. Intenta de nuevo.
              </p>
              <Button size="sm" variant="outline" className="mt-2" onClick={handleConnect}>
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      {!isConnected && !isConnecting && (
        <div className="border-t border-border p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">¿Cómo funciona?</h4>
          <ol className="space-y-2 text-xs text-muted">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green text-[10px] font-bold text-background">1</span>
              Da click en "Conectar" para generar un código QR
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green text-[10px] font-bold text-background">2</span>
              Abre WhatsApp → Dispositivos vinculados → Vincular dispositivo
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green text-[10px] font-bold text-background">3</span>
              Escanea el QR y listo — Omona empezará a responder automáticamente
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
