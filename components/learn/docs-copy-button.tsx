'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocsCopyButtonProps {
  text: string;
  className?: string;
  iconOnly?: boolean;
}

export function DocsCopyButton({ text, className, iconOnly = true }: DocsCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className={cn('h-6 gap-1.5 px-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground', className)}
      disabled={!text}
      onClick={copy}
      aria-label={isCopied ? 'Copied' : 'Copy code'}>
      {isCopied ? <Check className="size-3 shrink-0 text-green-500" /> : <Copy className="size-3 shrink-0" />}
      {!iconOnly && <span className="text-xs">{isCopied ? 'Copied' : 'Copy'}</span>}
    </Button>
  );
}
