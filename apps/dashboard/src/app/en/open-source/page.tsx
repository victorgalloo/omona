import { OssPage, ossMetadata } from '@/components/site/OpenSource';

export const dynamic = 'force-static';
export const metadata = ossMetadata('en');

export default function Page() {
  return <OssPage lang="en" />;
}
