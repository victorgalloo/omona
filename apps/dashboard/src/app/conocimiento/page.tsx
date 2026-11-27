import { ConocimientoPage, conocimientoMetadata } from '@/components/site/Conocimiento';

export const dynamic = 'force-static';
export const metadata = conocimientoMetadata('es');

export default function Page() {
  return <ConocimientoPage lang="es" />;
}
