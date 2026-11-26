import { VerificadorDominioPage, verificadorMetadata } from '@/components/site/VerificadorDominio';

export const dynamic = 'force-static';
export const metadata = verificadorMetadata('es');

export default function Page() {
  return <VerificadorDominioPage lang="es" />;
}
