'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { unified } from 'unified';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationErrorLevel,
} from '@shikijs/transformers';

interface MultiFileCodeBlockProps {
  files?: Array<{
    filename: string;
    language?: string;
    content: string;
    highlightLines?: number[];
  }>;
  title?: string;
}

export function MultiFileCodeBlock({ files, title }: MultiFileCodeBlockProps) {
  const safeFiles = useMemo(
    () =>
      Array.isArray(files)
        ? files.filter(
            (file) => file && typeof file.filename === 'string' && typeof file.content === 'string'
          )
        : [],
    [files]
  );
  const [activeTab, setActiveTab] = useState(safeFiles[0]?.filename ?? '');
  const [copied, setCopied] = useState<string | null>(null);
  const [highlightedContents, setHighlightedContents] = useState<string[]>([]);

  const activeFile = safeFiles.find((file) => file.filename === activeTab) ?? safeFiles[0];

  const copyToClipboard = async (content: string, filename: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(filename);
    setTimeout(() => setCopied(null), 1200);
  };

  useEffect(() => {
    if (safeFiles.length === 0) {
      setHighlightedContents([]);
      setActiveTab('');
      return;
    }

    setActiveTab((current) =>
      safeFiles.some((file) => file.filename === current) ? current : safeFiles[0].filename
    );

    let isActive = true;

    const processFiles = async () => {
      const promises = safeFiles.map(async (file) => {
        let meta = '';
        if (file.highlightLines && file.highlightLines.length > 0) {
          meta = ` {${file.highlightLines.join(',')}}`;
        }
        const md = `\`\`\`${file.language || 'plaintext'}${meta}\n${file.content}\n\`\`\``;
        const fileResult = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypePrettyCode, {
            theme: 'dracula',
            keepBackground: false,
            transformers: [
              transformerNotationDiff(),
              transformerNotationFocus(),
              transformerNotationErrorLevel(),
            ],
          })
          .use(rehypeStringify)
          .process(md);
        return String(fileResult);
      });
      const results = await Promise.all(promises);
      if (isActive) {
        setHighlightedContents(results);
      }
    };

    processFiles();

    return () => {
      isActive = false;
    };
  }, [safeFiles]);

  if (safeFiles.length === 0) {
    return title ? (
      <div className="my-8 rounded-lg border border-white/10 bg-card/50 p-5 text-sm text-muted-foreground">
        <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>
        <p>No files were provided for this code example.</p>
      </div>
    ) : null;
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-white/10 bg-[#101720] shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-[#101720] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {title && <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>}
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            {safeFiles.length} source file{safeFiles.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => activeFile && copyToClipboard(activeFile.content, activeFile.filename)}
          className="h-8 gap-1.5 self-start rounded-md border border-white/10 bg-background/55 px-2 text-xs text-muted-foreground hover:bg-background/80 hover:text-foreground sm:self-auto"
          aria-label={copied === activeFile?.filename ? 'Copied active file' : 'Copy active file'}>
          {copied === activeFile?.filename ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span>{copied === activeFile?.filename ? 'Copied' : 'Copy file'}</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto border-b border-white/10 bg-[#101720] px-2 py-2">
          <TabsList className="h-auto justify-start gap-1 bg-transparent p-0">
            {safeFiles.map((file) => (
              <TabsTrigger
                key={file.filename}
                value={file.filename}
                className="gap-2 rounded-md border border-transparent px-3 py-2 font-mono text-xs text-muted-foreground data-[state=active]:border-white/10 data-[state=active]:bg-card data-[state=active]:text-foreground">
                <FileText className="size-3.5" />
                {file.filename}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {safeFiles.map((file, index) => (
          <TabsContent key={file.filename} value={file.filename} className="m-0">
            <div className="mdx-code-frame not-prose relative bg-[#101720]">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#101720] px-4 py-2">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {file.language || 'text'}
                </span>
              </div>
              <div className="overflow-x-auto">
                {highlightedContents[index] ? (
                  <div
                    className={cn('min-w-full')}
                    dangerouslySetInnerHTML={{ __html: highlightedContents[index] }}
                  />
                ) : (
                  <pre className="m-0 p-4 text-sm leading-6">
                    <code className={`language-${file.language || 'plaintext'} `}>
                      {file.content}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
