import { VerificadorCabecerasPage, verificadorCabecerasMetadata } from '@/components/site/VerificadorCabeceras';

export const dynamic = 'force-static';
export const metadata = verificadorCabecerasMetadata('es');

export default function Page() {
  return <VerificadorCabecerasPage lang="es" />;
}
