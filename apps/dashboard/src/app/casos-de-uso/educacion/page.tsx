'use client';

import { GraduationCap, BookOpen, DollarSign, UserCheck, MessagesSquare } from 'lucide-react';
import { UseCasePageLayout } from '@/components/landing/UseCasePageLayout';

export default function EducacionPage() {
  return (
    <UseCasePageLayout
      icon={GraduationCap}
      tag="educación"
      title="Llena tus grupos"
      titleBreak="sin saturar admisiones"
      subtitle="El 70% de los prospectos educativos preguntan por WhatsApp. Omona responde sobre programas, costos y becas, y agenda entrevistas — sin que admisiones levante el teléfono."
      heroImage="/images/use-cases/college.jpg"
      stats={[
        { value: '70%', label: 'Consultas por WhatsApp' },
        { value: '4x', label: 'Más entrevistas agendadas' },
        { value: '< 1s', label: 'Respuesta a prospectos' },
        { value: '0', label: 'Prospectos sin atender' },
      ]}
      painPoints={[
        'El departamento de admisiones no da abasto en temporada de inscripciones',
        'Prospectos preguntan fuera de horario y nadie contesta hasta el día siguiente',
        'Padres y alumnos hacen las mismas preguntas una y otra vez',
        'No sabes cuántos prospectos se pierden por falta de seguimiento',
        'Información de becas y costos se comparte de forma inconsistente',
        'El proceso de "interesado" a "inscrito" no tiene visibilidad clara',
      ]}
      benefits={[
        {
          icon: BookOpen,
          title: 'Info de programas al instante',
          description: 'Plan de estudios, duración, modalidad, requisitos — Omona resuelve todas las dudas del prospecto sin demora ni inconsistencias.',
        },
        {
          icon: DollarSign,
          title: 'Costos y becas claros',
          description: 'Omona informa sobre colegiaturas, planes de pago, becas disponibles y requisitos financieros de forma transparente y uniforme.',
        },
        {
          icon: UserCheck,
          title: 'Entrevistas agendadas automáticamente',
          description: 'Cuando el prospecto está interesado, Omona agenda la entrevista de admisión o la clase muestra directo en el calendario.',
        },
        {
          icon: MessagesSquare,
          title: 'Atención a padres y alumnos',
          description: 'Responde consultas sobre horarios, transporte, uniformes y más. Reduce la carga de admisiones drásticamente.',
        },
      ]}
      conversation={[
        { role: 'user', text: 'Hola, me interesa la maestría en marketing digital. ¿Cuánto cuesta?' },
        { role: 'assistant', text: 'La Maestría en Marketing Digital tiene una duración de 18 meses en modalidad mixta. La colegiatura es de $5,800 MXN mensuales. Contamos con becas de hasta 30% para inscripción anticipada. ¿Te gustaría saber más sobre el plan de estudios?' },
        { role: 'user', text: 'Sí, y también si tienen horarios de fin de semana' },
        { role: 'assistant', text: 'El programa tiene grupo sabatino de 9am a 2pm, ideal si trabajas entre semana. Incluye SEO, paid media, analytics, content strategy y un proyecto final con empresa real. ¿Te agendo una sesión informativa con nuestra directora de admisiones?' },
      ]}
      industriesLabel="segmentos"
      industries={[
        'Universidades privadas',
        'Bootcamps de tech',
        'Academias de idiomas',
        'Escuelas K-12',
        'Cursos en línea',
        'Escuelas de negocios',
        'Centros de capacitación',
        'Posgrados y maestrías',
      ]}
      ctaTitle="Automatiza admisiones y llena tus grupos más rápido"
    />
  );
}
