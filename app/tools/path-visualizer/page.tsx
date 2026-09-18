import Header from '@/components/Header';
import { JsonLd } from '@/components/seo/json-ld';
import { constructMetadata, getWebApplicationSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import ClientPage from './ClientPage';

const title = 'Curriculum Path Visualizer';
const description =
  'Paste a YAML or JSON curriculum script and render an interactive path diagram powered by React Flow.';

export const metadata: Metadata = constructMetadata({
  title,
  description,
  path: '/tools/path-visualizer',
});

export default function Page() {
  return (
    <div className="bg-background">
      <JsonLd
        data={getWebApplicationSchema({
          title,
          description,
          path: '/tools/path-visualizer',
        })}
      />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <ClientPage />
      </div>
    </div>
  );
}
