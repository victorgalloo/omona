'use client';

import { Wrench, MessageSquare, Zap, Calendar, Target } from 'lucide-react';
import { UseCasePageLayout } from '@/components/landing/UseCasePageLayout';

export default function ServiciosPage() {
  return (
    <UseCasePageLayout
      icon={Wrench}
      tag="servicios"
      title="Vende más servicios"
      titleBreak="sin contestar WhatsApp"
      subtitle="Agencias, consultoras y freelancers pierden leads porque tardan en responder. Omona responde al instante, califica y agenda — tú solo cierras."
      heroImage="/images/use-cases/services.jpg"
      stats={[
        { value: '<1s', label: 'Tiempo de respuesta' },
        { value: '3x', label: 'Más leads atendidos' },
        { value: '68%', label: 'Tasa de agenda' },
        { value: '24/7', label: 'Disponibilidad' },
      ]}
      painPoints={[
        'Leads escriben y nadie responde porque estás en una junta',
        'Cotizaciones tardan horas o días en salir',
        'No sabes cuáles prospectos son serios y cuáles solo preguntan',
        'Pierdes seguimiento porque se te acumulan los chats',
        'Tu equipo gasta horas contestando las mismas preguntas',
        'No tienes CRM y llevas todo en Excel o en la cabeza',
      ]}
      benefits={[
        {
          icon: MessageSquare,
          title: 'Cotizaciones al instante',
          description: 'Omona responde preguntas sobre precios, paquetes y alcance en segundos. Conoce tu catálogo como tu mejor vendedor.',
        },
        {
          icon: Target,
          title: 'Calificación automática',
          description: 'Identifica presupuesto, timeline y necesidades del prospecto. Solo te conecta con leads que valen la pena — score de 0 a 100.',
        },
        {
          icon: Calendar,
          title: 'Agenda sin fricción',
          description: 'Cuando el prospecto está listo, Omona agenda la llamada o demo directo en tu calendario. Cero ida y vuelta de mensajes.',
        },
        {
          icon: Zap,
          title: 'Follow-up inteligente',
          description: 'Si el prospecto no responde, Omona hace seguimiento automático a las 24h. Ninguna oportunidad se escapa del radar.',
        },
      ]}
      conversation={[
        { role: 'user', text: 'Hola, vi su página. ¿Cuánto cuesta el servicio de branding?' },
        { role: 'assistant', text: '¡Hola! Gracias por tu interés. Nuestro servicio de branding incluye logo, paleta de colores, tipografía y manual de marca. El paquete completo tiene un precio de $15,000 MXN. ¿Te gustaría agendar una llamada para revisar tu proyecto?' },
        { role: 'user', text: 'Sí, pero necesitaría también el diseño del sitio web' },
        { role: 'assistant', text: 'Perfecto, tenemos un paquete de Branding + Web desde $28,000 MXN que incluye todo. ¿Qué día te funciona para una videollamada de 30 min? Tenemos disponibilidad mañana a las 10am o el jueves a las 3pm.' },
      ]}
      industriesLabel="industrias"
      industries={[
        'Agencias de marketing',
        'Consultoras',
        'Estudios de diseño',
        'Despachos contables',
        'Freelancers',
        'Desarrollo de software',
        'Fotografía y video',
        'Arquitectura e interiorismo',
      ]}
      ctaTitle="Deja de perder clientes por no contestar a tiempo"
    />
  );
}
