import { SeguridadPage, seguridadMetadata } from '@/components/site/Seguridad';

export const dynamic = 'force-static';
export const metadata = seguridadMetadata('en');

export default function Page() {
  return <SeguridadPage lang="en" />;
}
