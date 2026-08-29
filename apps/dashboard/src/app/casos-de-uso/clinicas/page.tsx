'use client';

import { Stethoscope, CalendarCheck, Bell, ShieldCheck, Clock } from 'lucide-react';
import { UseCasePageLayout } from '@/components/landing/UseCasePageLayout';

export default function ClinicasPage() {
  return (
    <UseCasePageLayout
      icon={Stethoscope}
      tag="salud"
      title="Tu recepcionista AI"
      titleBreak="que nunca falta"
      subtitle="Clínicas y consultorios pierden pacientes por no contestar a tiempo. Loomi agenda citas, responde dudas y envía recordatorios — 24/7, sin saturar a tu equipo."
      heroImage="/images/use-cases/clinic.jpg"
      stats={[
        { value: '-60%', label: 'Menos no-shows' },
        { value: '24/7', label: 'Agenda disponible' },
        { value: '< 1s', label: 'Respuesta promedio' },
        { value: '0', label: 'Llamadas perdidas' },
      ]}
      painPoints={[
        'Pacientes llaman y nadie contesta porque tu recepcionista está ocupada',
        'Pierdes citas porque la gente escribe fuera de horario y no obtiene respuesta',
        'No-shows recurrentes porque no envías recordatorios consistentes',
        'Tu recepcionista gasta horas respondiendo "¿cuánto cuesta?" y "¿tienen horario?"',
        'No tienes visibilidad de cuántas citas se pierden por falta de seguimiento',
        'Agendar una cita requiere 5+ mensajes de ida y vuelta',
      ]}
      benefits={[
        {
          icon: CalendarCheck,
          title: 'Agenda automática 24/7',
          description: 'Pacientes agendan citas a cualquier hora. Loomi muestra disponibilidad real y confirma al instante — incluso de madrugada.',
        },
        {
          icon: Bell,
          title: 'Recordatorios automáticos',
          description: 'Envía recordatorios 24h antes de la cita por WhatsApp. Reduce no-shows hasta un 60% sin esfuerzo manual.',
        },
        {
          icon: ShieldCheck,
          title: 'FAQ resueltas al instante',
          description: 'Horarios, precios, ubicación, preparación para estudios — Loomi responde todo sin intervención de tu equipo.',
        },
        {
          icon: Clock,
          title: 'Cero tiempo de espera',
          description: 'El paciente escribe y recibe respuesta en menos de 1 segundo. No más llamadas en espera ni mensajes ignorados.',
        },
      ]}
      conversation={[
        { role: 'user', text: 'Hola, ¿tienen citas disponibles para limpieza dental?' },
        { role: 'assistant', text: '¡Hola! Claro, tenemos disponibilidad esta semana. La limpieza dental tiene un costo de $800 MXN y dura aproximadamente 45 minutos. ¿Te funcionaría el miércoles a las 11am o el jueves a las 4pm?' },
        { role: 'user', text: 'El jueves a las 4 perfecto' },
        { role: 'assistant', text: 'Listo, tu cita queda confirmada para el jueves a las 4:00 PM con la Dra. García. Te enviaré un recordatorio un día antes. ¿A qué nombre agendo?' },
      ]}
      industriesLabel="especialidades"
      industries={[
        'Consultorios dentales',
        'Psicólogos y terapeutas',
        'Clínicas veterinarias',
        'Nutriólogos',
        'Médicos generales',
        'Dermatólogos',
        'Oftalmólogos',
        'Fisioterapeutas',
      ]}
      ctaTitle="Deja que Loomi atienda mientras tú consultas"
    />
  );
}
