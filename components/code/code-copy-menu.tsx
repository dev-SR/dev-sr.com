'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Copy, FileCode, FileText, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type CopiedKind = 'code' | 'path' | 'filename' | null;

interface CodeCopyMenuProps {
  code: string;
  /** Full path or bare filename from fence title (e.g. src/.../CreateProductCommand.cs). */
  filename?: string;
  className?: string;
  /** Aria / tooltip base label for the trigger. */
  label?: string;
  showCopyLabel?: boolean;
}

/** Split fence titles into full path + basename. Handles / and \ separators. */
export function splitFilePath(path: string): { fullPath: string; basename: string; hasDirectory: boolean } {
  const fullPath = path.trim();
  const parts = fullPath.split(/[/\\]+/).filter(Boolean);
  const basename = parts[parts.length - 1] ?? fullPath;
  const hasDirectory = parts.length > 1;
  return { fullPath, basename, hasDirectory };
}

export function CodeCopyMenu({
  code,
  filename,
  className,
  label = 'Copy',
  showCopyLabel = false,
}: CodeCopyMenuProps) {
  const [copied, setCopied] = useState<CopiedKind>(null);
  const pathParts = useMemo(
    () => (filename?.trim() ? splitFilePath(filename) : null),
    [filename]
  );

  const canCopyCode = Boolean(code);
  const canCopyPath = Boolean(pathParts?.fullPath);
  const disabled = !canCopyCode && !canCopyPath;

  const copy = async (kind: Exclude<CopiedKind, null>, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={disabled}
          className={cn(
            'gap-0.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            showCopyLabel ? 'h-7 rounded px-2 text-xs' : 'h-6 px-1.5',
            className
          )}
          aria-label={copied ? 'Copied' : label}>
          {copied ? (
            <Check
              className={cn('shrink-0 text-green-500', showCopyLabel ? 'size-3.5' : 'size-3')}
            />
          ) : (
            <Copy className={cn('shrink-0', showCopyLabel ? 'size-3.5' : 'size-3')} />
          )}
          {showCopyLabel && <span>{copied ? 'Copied' : 'Copy'}</span>}
          <ChevronDown className="size-2.5 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuItem
          disabled={!canCopyCode}
          onSelect={() => void copy('code', code)}>
          <FileCode className="size-3.5" />
          <span className="flex-1">Copy code</span>
          {copied === 'code' && <Check className="size-3.5 text-green-500" />}
        </DropdownMenuItem>

        {pathParts && pathParts.hasDirectory && (
          <DropdownMenuItem onSelect={() => void copy('path', pathParts.fullPath)}>
            <FolderTree className="size-3.5" />
            <span className="min-w-0 flex-1">
              <span className="block">Copy path</span>
              <span
                className="block truncate font-mono text-xs text-muted-foreground"
                title={pathParts.fullPath}>
                {pathParts.fullPath}
              </span>
            </span>
            {copied === 'path' && <Check className="size-3.5 text-green-500" />}
          </DropdownMenuItem>
        )}

        {pathParts && (
          <DropdownMenuItem onSelect={() => void copy('filename', pathParts.basename)}>
            <FileText className="size-3.5" />
            <span className="min-w-0 flex-1">
              <span className="block">Copy filename</span>
              <span
                className="block truncate font-mono text-xs text-muted-foreground"
                title={pathParts.basename}>
                {pathParts.basename}
              </span>
            </span>
            {copied === 'filename' && <Check className="size-3.5 text-green-500" />}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
