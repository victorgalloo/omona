import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos de Uso | Loomi',
  description: 'Términos y condiciones de uso de Loomi. Conoce las reglas que rigen el uso de nuestra plataforma.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            <span className="font-mono font-semibold text-sm text-foreground ml-1.5">loomi_</span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <p className="font-mono text-xs text-[#27C93F] mb-3">terms_of_service</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Términos de Uso</h1>
        <p className="text-sm text-muted mb-12">Última actualización: 27 de marzo de 2026</p>

        <div className="space-y-10 text-muted-foreground text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Aceptación de los términos</h2>
            <p>Al acceder y utilizar Loomi ("el Servicio"), operado por Anthana ("nosotros"), aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar el Servicio. El uso continuado del Servicio después de la publicación de cambios constituye la aceptación de dichos cambios.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Descripción del servicio</h2>
            <p>Loomi es una plataforma de automatización de ventas por WhatsApp que utiliza inteligencia artificial. El Servicio incluye:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>Conexión con WhatsApp para envío y recepción automática de mensajes.</li>
              <li>Agente de inteligencia artificial para respuestas automatizadas.</li>
              <li>CRM con gestión de leads, pipeline de ventas y calificación automática.</li>
              <li>Agenda de citas y recordatorios automáticos.</li>
              <li>Panel de analíticas y métricas de rendimiento.</li>
              <li>Aplicación móvil con notificaciones push.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Registro y cuenta</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Debes proporcionar información veraz y actualizada al registrarte.</li>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
              <li>Cada cuenta está vinculada a una organización. Los administradores pueden invitar miembros con roles de agente o visor.</li>
              <li>Debes ser mayor de 18 años para usar el Servicio.</li>
              <li>Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Planes y pagos</h2>
            <p className="mb-3">Loomi ofrece diferentes planes de suscripción:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-foreground">Prueba gratuita:</strong> 14 días sin costo ni tarjeta de crédito requerida.</li>
              <li><strong className="text-foreground">Plan Pro:</strong> suscripción mensual con las funcionalidades incluidas en el plan. Limitado a 1,000 conversaciones por mes.</li>
              <li><strong className="text-foreground">Plan Custom:</strong> plan personalizado para empresas con necesidades específicas.</li>
            </ul>
            <p className="mt-3">Los precios están expresados en pesos mexicanos (MXN) e incluyen IVA donde aplique. Nos reservamos el derecho de modificar los precios con 30 días de aviso previo.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Uso aceptable</h2>
            <p className="mb-3">Al usar Loomi, te comprometes a:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Cumplir con las políticas de uso de WhatsApp y sus términos de servicio.</li>
              <li>No enviar spam, mensajes no solicitados o contenido ilegal a través de la plataforma.</li>
              <li>No utilizar el servicio para actividades fraudulentas, engañosas o ilegales.</li>
              <li>No intentar acceder a datos de otras organizaciones o cuentas.</li>
              <li>No realizar ingeniería inversa, descompilar o intentar extraer el código fuente del Servicio.</li>
              <li>Obtener el consentimiento necesario de tus contactos antes de enviarles mensajes automatizados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Inteligencia artificial</h2>
            <p className="mb-3">El Servicio utiliza inteligencia artificial para automatizar respuestas. Debes tener en cuenta que:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Las respuestas generadas por IA pueden no ser siempre perfectas o apropiadas.</li>
              <li>Eres responsable de configurar adecuadamente tu agente (productos, FAQs, tono, modo de venta).</li>
              <li>El sistema de handoff permite transferir conversaciones a un humano cuando sea necesario.</li>
              <li>Loomi no garantiza la precisión de la calificación automática de leads.</li>
              <li>Es tu responsabilidad supervisar las conversaciones y ajustar la configuración del agente según sea necesario.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Propiedad intelectual</h2>
            <p>El Servicio, incluyendo su diseño, código, logotipos y contenido, es propiedad de Anthana. Tu suscripción te otorga una licencia limitada, no exclusiva y no transferible para usar el Servicio. El contenido que generes (configuraciones, datos de leads, conversaciones) sigue siendo de tu propiedad.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Aplicación móvil (iOS)</h2>
            <p className="mb-3">Al descargar y usar la aplicación móvil de Loomi desde la App Store de Apple, aceptas adicionalmente que:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>La licencia de uso se limita a un dispositivo iOS de tu propiedad o control.</li>
              <li>Apple no tiene obligación alguna de proveer servicios de mantenimiento o soporte para la app.</li>
              <li>En caso de que la app no cumpla con alguna garantía aplicable, puedes notificar a Apple para obtener un reembolso del precio de compra (si aplica). Apple no tendrá otra obligación de garantía respecto a la app.</li>
              <li>Apple no es responsable de atender reclamaciones tuyas o de terceros relacionadas con la app, incluyendo reclamaciones de responsabilidad del producto, incumplimiento de requisitos legales o protección al consumidor.</li>
              <li>En caso de reclamaciones de terceros por infracción de propiedad intelectual relacionada con la app, Anthana (no Apple) será el único responsable de la investigación, defensa y resolución.</li>
              <li>Apple y sus subsidiarias son terceros beneficiarios de estos términos en lo que respecta a la app móvil, y pueden hacer valer estos términos contra ti.</li>
              <li>Debes cumplir con los términos de servicio de terceros aplicables al usar la app (por ejemplo, tu acuerdo de servicio de datos inalámbricos).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Disponibilidad del servicio</h2>
            <p>Nos esforzamos por mantener el Servicio disponible 24/7, pero no garantizamos una disponibilidad ininterrumpida. Pueden ocurrir interrupciones por mantenimiento, actualizaciones o circunstancias fuera de nuestro control. La conexión con WhatsApp depende de la disponibilidad de WhatsApp y puede verse afectada por cambios en su plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley, Anthana no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso del Servicio, incluyendo pero no limitado a: pérdida de ventas, pérdida de datos, interrupciones de servicio, o respuestas inadecuadas generadas por la inteligencia artificial.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Cancelación</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta.</li>
              <li>Al cancelar, mantendrás acceso hasta el final del período de facturación actual.</li>
              <li>Puedes exportar tus datos (conversaciones, leads) en formato CSV antes de cancelar.</li>
              <li>Nos reservamos el derecho de cancelar cuentas que violen estos términos sin previo aviso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Ley aplicable</h2>
            <p>Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales competentes de la Ciudad de Cancún, Quintana Roo, México.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Contacto</h2>
            <p>Para preguntas sobre estos términos, contáctanos en:</p>
            <p className="mt-2 font-mono text-[#27C93F]">hello@loomi.lat</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} loomi by anthana</p>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
