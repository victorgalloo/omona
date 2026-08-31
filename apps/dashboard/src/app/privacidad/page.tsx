import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '../../components/shared/Logo';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Omona',
  description: 'Política de privacidad de Omona. Conoce cómo recopilamos, usamos y protegemos tu información.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Logo size={18} className="shrink-0 text-foreground" />
            <span className="font-mono font-semibold text-sm text-foreground ml-1.5">omona_</span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <p className="font-mono text-xs text-[#27C93F] mb-3">privacy_policy</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted mb-12">Última actualización: 27 de marzo de 2026</p>

        <div className="space-y-10 text-muted-foreground text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Información que recopilamos</h2>
            <p className="mb-3">Omona, operado por Anthana ("nosotros", "nuestro"), recopila la siguiente información cuando usas nuestros servicios:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-foreground">Datos de cuenta:</strong> nombre, correo electrónico, contraseña (encriptada) y datos de perfil al registrarte.</li>
              <li><strong className="text-foreground">Datos de WhatsApp:</strong> número de teléfono, mensajes enviados y recibidos a través de la plataforma, nombre de contacto.</li>
              <li><strong className="text-foreground">Datos de leads:</strong> información de contacto, empresa, puntuación de lead, notas y campos personalizados que ingreses.</li>
              <li><strong className="text-foreground">Datos de uso:</strong> interacciones con el dashboard, configuraciones del agente IA, registros de actividad.</li>
              <li><strong className="text-foreground">Datos del dispositivo:</strong> tipo de navegador, sistema operativo, dirección IP y tokens de notificaciones push.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Cómo usamos tu información</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Proveer y mantener el servicio de automatización de ventas por WhatsApp.</li>
              <li>Procesar conversaciones con inteligencia artificial para generar respuestas automáticas.</li>
              <li>Calificar leads, gestionar el pipeline de ventas y agendar citas.</li>
              <li>Enviar notificaciones push sobre handoffs, nuevos mensajes y recordatorios de citas.</li>
              <li>Mejorar nuestros modelos de IA y la calidad del servicio.</li>
              <li>Comunicarnos contigo sobre actualizaciones, soporte y cambios en el servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Inteligencia artificial y procesamiento de datos</h2>
            <p>Omona utiliza modelos de inteligencia artificial de terceros (incluyendo Azure AI y otros proveedores) para procesar los mensajes de tus clientes y generar respuestas automatizadas. Los mensajes se envían a estos servicios de IA para su procesamiento en tiempo real. No usamos tus datos para entrenar modelos de IA de terceros. La configuración de tu agente (productos, FAQs, personalidad) se usa únicamente para personalizar las respuestas dentro de tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Almacenamiento y seguridad</h2>
            <p>Tus datos se almacenan de forma segura en servidores gestionados por Supabase (PostgreSQL) con cifrado en tránsito y en reposo. Implementamos políticas de seguridad a nivel de fila (RLS) para garantizar el aislamiento de datos entre organizaciones. Las credenciales de sesión de WhatsApp se almacenan cifradas.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Compartir información con terceros</h2>
            <p className="mb-3">No vendemos tu información personal. Compartimos datos únicamente con:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-foreground">Proveedores de IA:</strong> para procesar mensajes y generar respuestas (Azure AI, Groq).</li>
              <li><strong className="text-foreground">Supabase:</strong> para almacenamiento de datos y autenticación.</li>
              <li><strong className="text-foreground">Resend:</strong> para envío de correos electrónicos de notificación.</li>
              <li><strong className="text-foreground">Apple Push Notification Service (APNs):</strong> para notificaciones push en dispositivos iOS.</li>
              <li><strong className="text-foreground">Autoridades legales:</strong> cuando sea requerido por ley.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Notificaciones push</h2>
            <p>Si usas nuestra aplicación móvil, podemos enviarte notificaciones push sobre nuevos mensajes, handoffs y recordatorios de citas. Puedes desactivar las notificaciones push en cualquier momento desde la configuración de tu dispositivo.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Retención de datos</h2>
            <p>Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta, eliminaremos tus datos personales en un plazo de 30 días, excepto cuando la ley requiera que los conservemos por más tiempo. Los registros de conversaciones se pueden exportar en formato CSV antes de la eliminación.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Tus derechos</h2>
            <p className="mb-3">De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-foreground">Acceso:</strong> solicitar una copia de tus datos personales.</li>
              <li><strong className="text-foreground">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong className="text-foreground">Cancelación:</strong> solicitar la eliminación de tus datos.</li>
              <li><strong className="text-foreground">Oposición:</strong> oponerte al tratamiento de tus datos para fines específicos.</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos (derechos ARCO), contacta a <span className="text-[#27C93F] font-mono">hello@omona.tech</span></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Menores de edad</h2>
            <p>Omona no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores de edad. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos de inmediato. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos en <span className="text-[#27C93F] font-mono">hello@omona.tech</span>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Eliminación de cuenta y datos</h2>
            <p className="mb-3">Puedes solicitar la eliminación de tu cuenta y todos tus datos personales en cualquier momento. Para hacerlo:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Desde la app o el dashboard, ve a Configuración y selecciona "Eliminar cuenta".</li>
              <li>Envía un correo a <span className="text-[#27C93F] font-mono">hello@omona.tech</span> con el asunto "Eliminar cuenta".</li>
            </ul>
            <p className="mt-3">Procesaremos la solicitud en un plazo máximo de 30 días. Se eliminarán: datos de perfil, conversaciones, leads, configuraciones del agente, citas y tokens de notificaciones push. Algunos datos pueden conservarse de forma anónima con fines estadísticos o cuando la ley lo requiera.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Rastreo y publicidad</h2>
            <p>Omona no rastrea tu actividad en otras apps o sitios web. No utilizamos identificadores publicitarios (IDFA) ni participamos en redes publicitarias. No vendemos ni compartimos tus datos con fines publicitarios de terceros.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Transferencias internacionales de datos</h2>
            <p>Tus datos pueden ser procesados en servidores ubicados fuera de México, incluyendo Estados Unidos (proveedores de IA y servicios en la nube). Al usar el Servicio, consientes la transferencia de tus datos a estos países. Nos aseguramos de que nuestros proveedores cumplan con estándares de protección de datos equivalentes o superiores a los requeridos por la legislación mexicana.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Cambios a esta política</h2>
            <p>Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios significativos a través de correo electrónico o mediante un aviso en la plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Contacto</h2>
            <p>Si tienes preguntas sobre esta política de privacidad, contáctanos en:</p>
            <p className="mt-2 font-mono text-[#27C93F]">hello@omona.tech</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} omona by anthana</p>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/terminos" className="hover:text-foreground transition-colors">Términos de uso</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
