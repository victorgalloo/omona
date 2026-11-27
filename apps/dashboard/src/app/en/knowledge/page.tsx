import { ConocimientoPage, conocimientoMetadata } from '@/components/site/Conocimiento';

export const dynamic = 'force-static';
export const metadata = conocimientoMetadata('en');

export default function Page() {
  return <ConocimientoPage lang="en" />;
}
