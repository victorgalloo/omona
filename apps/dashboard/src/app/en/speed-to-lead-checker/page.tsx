import { VerificadorEmbudoPage, verificadorEmbudoMetadata } from '@/components/site/VerificadorEmbudo';

export const dynamic = 'force-static';
export const metadata = verificadorEmbudoMetadata('en');

export default function Page() {
  return <VerificadorEmbudoPage lang="en" />;
}
