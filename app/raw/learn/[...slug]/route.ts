import fs from 'node:fs/promises';
import { getLearnSourcePath } from '@/lib/learn';

export const runtime = 'nodejs';

type RouteParams = { params: Promise<{ slug?: string[] }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const slug = (await params).slug?.join('/') ?? '';
  const filePath = await getLearnSourcePath(slug);

  if (!filePath) {
    return new Response('Not found', { status: 404 });
  }

  const body = await fs.readFile(filePath, 'utf8');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=3600',
    },
  });
}
