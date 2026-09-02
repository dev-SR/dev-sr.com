'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyableFilenameProps {
  filename: string;
  className?: string;
}

export function CopyableFilename({ filename, className }: CopyableFilenameProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(filename);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy path: ${filename}`}
      className={cn(
        'group flex min-w-0 max-w-full items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Path copied' : `Copy path ${filename}`}>
      <span className="truncate">{filename}</span>
      {copied ? (
        <Check className="size-3 shrink-0 text-green-500" aria-hidden />
      ) : (
        <Copy
          className="size-3 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  );
}
