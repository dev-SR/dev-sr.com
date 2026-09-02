'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeCopyButtonProps {
  text: string;
  className?: string;
  /** Show icon only (default). Set false or use showCopyLabel for labeled button. */
  iconOnly?: boolean;
  showCopyLabel?: boolean;
  label?: string;
  copiedLabel?: string;
}

export function CodeCopyButton({
  text,
  className,
  iconOnly = true,
  showCopyLabel = false,
  label = 'Copy',
  copiedLabel = 'Copied',
}: CodeCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const showLabel = showCopyLabel || !iconOnly;

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
      className={cn(
        'gap-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        showLabel ? 'h-7 rounded px-2 text-xs' : 'h-6 px-2',
        className
      )}
      disabled={!text}
      onClick={copy}
      aria-label={isCopied ? copiedLabel : label}>
      {isCopied ? (
        <Check className={cn('shrink-0 text-green-500', showLabel ? 'size-3.5' : 'size-3')} />
      ) : (
        <Copy className={cn('shrink-0', showLabel ? 'size-3.5' : 'size-3')} />
      )}
      {showLabel && <span>{isCopied ? copiedLabel : label}</span>}
    </Button>
  );
}

/** @deprecated Use CodeCopyButton */
export const CopyButton = CodeCopyButton;
/** @deprecated Use CodeCopyButton */
export const DocsCopyButton = CodeCopyButton;
