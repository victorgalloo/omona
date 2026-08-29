'use client';

import { Building2, Filter, Users, MapPin, TrendingUp } from 'lucide-react';
import { UseCasePageLayout } from '@/components/landing/UseCasePageLayout';

export default function BienesRaicesPage() {
  return (
    <UseCasePageLayout
      icon={Building2}
      tag="inmobiliarias"
      title="Califica prospectos"
      titleBreak="antes de la visita"
      subtitle="En bienes raíces, cada visita cuesta tiempo y dinero. Omona filtra prospectos por presupuesto, zona y necesidades — tu asesor solo atiende leads reales."
      heroImage="/images/use-cases/real-state.jpg"
      stats={[
        { value: '80%', label: 'Leads pre-calificados' },
        { value: '5x', label: 'Menos visitas perdidas' },
        { value: '<1s', label: 'Primera respuesta' },
        { value: '100', label: 'Lead score automático' },
      ]}
      painPoints={[
        'Asesores pierden el día en visitas con prospectos que no tienen presupuesto',
        'Leads de portales inmobiliarios escriben y nadie contesta rápido',
        'No sabes si el prospecto busca compra, renta o solo está "viendo"',
        'Tu equipo no da seguimiento consistente a todos los leads',
        'Pierdes prospectos porque otro asesor respondió primero',
        'No tienes un pipeline claro de en qué etapa está cada prospecto',
      ]}
      benefits={[
        {
          icon: Filter,
          title: 'Filtro automático',
          description: 'Omona pregunta presupuesto, zona, recámaras y tipo de operación. Tu asesor recibe un lead con toda la info lista.',
        },
        {
          icon: MapPin,
          title: 'Info de propiedades al instante',
          description: 'Precios, amenidades, ubicación, disponibilidad — Omona resuelve todo sobre tu inventario sin que tu equipo intervenga.',
        },
        {
          icon: Users,
          title: 'Handoff al asesor correcto',
          description: 'Cuando el lead califica, Omona lo transfiere con todo el contexto: presupuesto, preferencias, urgencia y score.',
        },
        {
          icon: TrendingUp,
          title: 'Pipeline visual',
          description: 'Visualiza todos tus prospectos en un Kanban: desde primer contacto hasta cierre. Sin Excel, sin perder seguimiento.',
        },
      ]}
      conversation={[
        { role: 'user', text: 'Hola, busco un depa en la Roma o Condesa, máximo 4 millones' },
        { role: 'assistant', text: '¡Hola! Tenemos varias opciones en esa zona. ¿Buscas 1 o 2 recámaras? ¿Es para vivir o como inversión?' },
        { role: 'user', text: '2 recámaras, para vivir. Con estacionamiento de preferencia' },
        { role: 'assistant', text: 'Perfecto. Tenemos 3 opciones que se ajustan: un depa en Roma Norte de 85m² ($3.8M), uno en Condesa de 78m² ($3.5M) y uno nuevo en Roma Sur de 92m² ($3.9M). Todos con estacionamiento. ¿Te gustaría agendar una visita con nuestro asesor?' },
      ]}
      industriesLabel="segmentos"
      industries={[
        'Desarrolladoras',
        'Corredores inmobiliarios',
        'Inmobiliarias',
        'Constructoras',
        'Brokers hipotecarios',
        'Propiedades vacacionales',
        'Renta de departamentos',
        'Coworkings',
      ]}
      ctaTitle="Deja de perder tiempo con prospectos que no califican"
    />
  );
}
