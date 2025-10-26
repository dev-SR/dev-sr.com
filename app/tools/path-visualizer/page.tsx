import Header from '@/components/Header';
import ClientPage from './ClientPage';

export default function Page() {
  return (
    <div className="bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Path Visualizer</h1>
          <p className="text-muted-foreground">
            Paste a YAML or JSON curriculum script and render an interactive path diagram powered by React Flow.
          </p>
        </div>
        <ClientPage />
      </div>
    </div>
  );
}
