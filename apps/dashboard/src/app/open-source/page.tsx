import { OssPage, ossMetadata } from '@/components/site/OpenSource';

export const dynamic = 'force-static';
export const metadata = ossMetadata('es');

export default function Page() {
  return <OssPage lang="es" />;
}
