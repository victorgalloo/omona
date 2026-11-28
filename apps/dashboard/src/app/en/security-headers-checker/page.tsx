import { VerificadorCabecerasPage, verificadorCabecerasMetadata } from '@/components/site/VerificadorCabeceras';

export const dynamic = 'force-static';
export const metadata = verificadorCabecerasMetadata('en');

export default function Page() {
  return <VerificadorCabecerasPage lang="en" />;
}
