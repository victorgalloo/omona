'use client';

import { useEffect, useState, useCallback } from 'react';
import { Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface QRResponse {
  qr_code: string | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_pending';
}

interface StepConnectWhatsAppProps {
  onComplete: () => void;
}

export function StepConnectWhatsApp({ onComplete }: StepConnectWhatsAppProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<QRResponse['status']>('disconnected');

  const pollQR = useCallback(async () => {
    try {
      const res = await api.get<QRResponse>('/api/whatsapp/qr');
      setQrCode(res.qr_code);
      setStatus(res.status);
      if (res.status === 'connected') {
        onComplete();
      }
    } catch {
      // Retry on failure
    }
  }, [onComplete]);

  // Este componente sólo consultaba el QR y nunca pedía generarlo, así que se
  // quedaba esperando indefinidamente un código que nadie había creado.
  // Arrancar la sesión es responsabilidad de quien muestra la pantalla.
  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const actual = await api.get<QRResponse>('/api/whatsapp/qr');
        if (cancelado) return;
        setQrCode(actual.qr_code);
        setStatus(actual.status);
        if (actual.status === 'connected') { onComplete(); return; }
        // Sólo arrancar si no hay nada en curso: /connect limpia el QR y pone
        // la sesión en 'connecting', así que llamarlo sobre una sesión viva la
        // tumbaría.
        if (actual.status === 'disconnected') {
          await api.post('/api/whatsapp/connect');
        }
      } catch {
        // Si falla, el polling de abajo lo vuelve a intentar.
      }
    })();

    return () => { cancelado = true; };
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(pollQR, 3000);
    return () => clearInterval(interval);
  }, [pollQR]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
        <Smartphone className="h-8 w-8 text-accent-green" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        Conecta tu WhatsApp
      </h2>
      <p className="mb-8 text-center text-sm text-muted">
        Escanea el código QR con tu WhatsApp para vincular tu número de negocio
      </p>

      {status === 'connected' ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10">
            <CheckCircle2 className="h-10 w-10 text-accent-green" />
          </div>
          <p className="text-lg font-medium text-accent-green">¡Conectado!</p>
          <p className="text-sm text-muted">Tu WhatsApp está vinculado correctamente</p>
        </div>
      ) : qrCode ? (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl border-2 border-border bg-background p-4 shadow-sm">
            {/* QR Code rendered as an image from base64 or URL */}
            <img
              src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
              alt="QR Code"
              className="h-64 w-64"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Esperando escaneo...
          </div>
          <div className="mt-4 rounded-lg bg-surface p-4 text-sm text-muted">
            <p className="mb-2 font-medium text-foreground">Instrucciones:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Abre WhatsApp en tu teléfono</li>
              <li>Ve a Ajustes → Dispositivos vinculados</li>
              <li>Toca &quot;Vincular un dispositivo&quot;</li>
              <li>Escanea este código QR</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-green" />
          <p className="text-sm text-muted">
            {status === 'connecting' ? 'Conectando...' : 'Generando código QR...'}
          </p>
        </div>
      )}
    </div>
  );
}
