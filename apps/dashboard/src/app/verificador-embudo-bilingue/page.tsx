import { VerificadorEmbudoPage, verificadorEmbudoMetadata } from '@/components/site/VerificadorEmbudo';

export const dynamic = 'force-static';
export const metadata = verificadorEmbudoMetadata('es');

export default function Page() {
  return <VerificadorEmbudoPage lang="es" />;
}
