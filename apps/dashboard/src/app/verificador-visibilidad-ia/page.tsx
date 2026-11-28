import { VerificadorVisibilidadPage, verificadorVisibilidadMetadata } from '@/components/site/VerificadorVisibilidad';

export const dynamic = 'force-static';
export const metadata = verificadorVisibilidadMetadata('es');

export default function Page() {
  return <VerificadorVisibilidadPage lang="es" />;
}
