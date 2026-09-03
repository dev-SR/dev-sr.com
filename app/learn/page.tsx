import Header from '@/components/Header';
import { LearnHub } from '@/components/learn/learn-hub';
import { getLearnCatalog } from '@/lib/learn';

export default async function LearnPage() {
  const catalog = await getLearnCatalog();

  return (
    <div className="bg-background">
      <Header />
      <LearnHub courses={catalog.courses} lessons={catalog.lessons} />
    </div>
  );
}
