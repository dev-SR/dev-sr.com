import Image from 'next/image';
import type React from 'react';
import { Children, isValidElement } from 'react';
import { cn } from '@/lib/utils';

type FigureSize = 'sm' | 'md' | 'lg' | 'full';
type FigureAlign = 'left' | 'center' | 'right';

export type FigureProps = {
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  size?: FigureSize;
  align?: FigureAlign;
  maxWidth?: number | string;
  priority?: boolean;
  className?: string;
};

const figureSizeClass: Record<FigureSize, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  full: 'max-w-none',
};

const figureAlignClass: Record<FigureAlign, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

const figureSizesMap: Record<FigureSize, string> = {
  sm: '(min-width: 1024px) 576px, 100vw',
  md: '(min-width: 1024px) 768px, 100vw',
  lg: '(min-width: 1024px) 1024px, 100vw',
  full: '100vw',
};

function coerceDimension(value: number | string | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function findImageProps(children: React.ReactNode): { src?: string; alt?: string } {
  let result: { src?: string; alt?: string } = {};

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === 'img') {
      const props = child.props as { src?: string; alt?: string };
      result = { src: props.src, alt: props.alt };
      return;
    }

    const nested = findImageProps((child.props as { children?: React.ReactNode }).children);
    if (nested.src) result = nested;
  });

  return result;
}

export function Figure({
  src,
  alt,
  caption,
  children,
  width = 960,
  height = 600,
  size = 'md',
  align = 'center',
  maxWidth,
  priority = false,
  className,
}: FigureProps) {
  const childImage = children ? findImageProps(children) : {};
  const imageSrc = src ?? childImage.src ?? '/placeholder.svg';
  const imageAlt = alt ?? childImage.alt ?? 'Image';
  const imageWidth = coerceDimension(width, 960);
  const imageHeight = coerceDimension(height, 600);
  const style = maxWidth
    ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
    : undefined;

  return (
    <figure
      className={cn('my-10 w-full', figureSizeClass[size], figureAlignClass[align], className)}
      style={style}>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-card/40 shadow-xl shadow-black/20">
        {children ? (
          Children.map(children, (child) => {
            if (!isValidElement(child) || child.type !== 'img') return child;

            const props = child.props as { src?: string; alt?: string; className?: string };
            return (
              <Image
                key={props.src}
                src={props.src ?? imageSrc}
                alt={props.alt ?? imageAlt}
                width={imageWidth}
                height={imageHeight}
                priority={priority}
                sizes={figureSizesMap[size]}
                className={cn('h-auto w-full object-cover', props.className)}
              />
            );
          })
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            priority={priority}
            sizes={figureSizesMap[size]}
            className="h-auto w-full object-cover"
          />
        )}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MdxImage({ src, alt, ...props }: React.ComponentPropsWithoutRef<'img'>) {
  const safeSrc = typeof src === 'string' ? src : '/placeholder.svg';
  const altText = alt ?? 'Image';

  return (
    <Figure
      src={safeSrc}
      alt={altText}
      width={800}
      height={500}
      {...(props as Partial<FigureProps>)}
    />
  );
}

function isBlockElement(child: React.ReactElement): boolean {
  const type = child.type;

  if (typeof type === 'string') {
    return ['img', 'figure', 'pre', 'div', 'blockquote', 'table', 'ul', 'ol', 'hr'].includes(type);
  }

  if (typeof type === 'function') {
    const name = type.displayName || type.name;
    if (
      name === 'MdxImage' ||
      name === 'Figure' ||
      name === 'PreCustom' ||
      name === 'PrettyCodeFigure' ||
      name === 'CodeTabs' ||
      name === 'CodeFrame'
    ) {
      return true;
    }
  }

  return typeof (child.props as { src?: unknown }).src === 'string';
}

function splitParagraphChildren(children: React.ReactNode) {
  const meaningfulChildren = Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim().length > 0
  );

  const blockChildren: React.ReactNode[] = [];
  const inlineChildren: React.ReactNode[] = [];

  meaningfulChildren.forEach((child) => {
    if (isValidElement(child) && isBlockElement(child)) {
      blockChildren.push(child);
      return;
    }
    inlineChildren.push(child);
  });

  return { blockChildren, inlineChildren };
}

export function Paragraph({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  const { blockChildren, inlineChildren } = splitParagraphChildren(children);

  if (blockChildren.length === 0) {
    return (
      <p className="mb-6 text-[1.03rem] leading-8 text-muted-foreground" {...props}>
        {children}
      </p>
    );
  }

  if (inlineChildren.length === 0) {
    return <>{children}</>;
  }

  return (
    <>
      <p className="mb-6 text-[1.03rem] leading-8 text-muted-foreground" {...props}>
        {inlineChildren}
      </p>
      {blockChildren}
    </>
  );
}
