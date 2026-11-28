import { VerificadorVisibilidadPage, verificadorVisibilidadMetadata } from '@/components/site/VerificadorVisibilidad';

export const dynamic = 'force-static';
export const metadata = verificadorVisibilidadMetadata('en');

export default function Page() {
  return <VerificadorVisibilidadPage lang="en" />;
}
