'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  text,
  className,
  label = 'Copy',
  copiedLabel = 'Copied',
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1200);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className={cn(
        'h-7 gap-1.5 rounded px-2 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground',
        className
      )}
      disabled={!text || isCopied}
      onClick={copy}
      aria-label={isCopied ? copiedLabel : label}>
      {isCopied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      <span>{isCopied ? copiedLabel : label}</span>
    </Button>
  );
}
