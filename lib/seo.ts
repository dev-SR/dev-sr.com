import type { Metadata } from 'next';
import { education, profile, publications, skillGroups } from '@/lib/profile';

const DEFAULT_SITE_URL = 'https://dev-sr.vercel.app';

export const siteConfig = {
  name: profile.name,
  siteName: 'Sharukh Rahman | dev-sr',
  url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
  title: 'Sharukh Rahman | Data Science Student & Software Engineer',
  description:
    'Portfolio, technical writing, system design courses, and engineering experiments by Sharukh Rahman — MSc Data Science at Óbuda University, formerly .NET software engineer.',
  locale: 'en_US',
  language: 'en',
  author: profile.name,
  email: profile.email,
  location: profile.location,
  social: {
    github: profile.github,
    linkedin: profile.linkedin,
    email: `mailto:${profile.email}`,
  },
  brandColors: {
    coral: '#F08F87',
    slate: '#ACC5D3',
    dark: '#0A0A0A',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined,
  },
} as const;

export type BreadcrumbItem = {
  name: string;
  href: string;
};

type ConstructMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  authors?: string[];
};

function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalized === '/' ? '' : normalized}`;
}

/** Dynamic OG cards for catch-all blog/learn routes live at /api/og (Next.js disallows opengraph-image under [...slug]). */
export function defaultOgImagePath(path = '/'): string {
  if (path.startsWith('/blog/') && path !== '/blog/') {
    const slug = path.replace(/^\/blog\//, '');
    return `/api/og?kind=blog&slug=${encodeURIComponent(slug)}`;
  }
  if (path.startsWith('/learn/') && path !== '/learn/') {
    const slug = path.replace(/^\/learn\//, '');
    return `/api/og?kind=learn&slug=${encodeURIComponent(slug)}`;
  }
  return '/opengraph-image';
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
  tags,
  authors = [siteConfig.author],
}: ConstructMetadataInput = {}): Metadata {
  const canonical = absoluteUrl(path);
  const ogImagePath = image ?? defaultOgImagePath(path);
  const ogImage = absoluteUrl(ogImagePath);
  // Short titles rely on layout `title.template` ("%s | Sharukh Rahman").
  // Root / default uses the layout `title.default` via absolute.
  const resolvedTitle: Metadata['title'] = title
    ? title
    : { absolute: siteConfig.title };
  const socialTitle = title ?? siteConfig.title;

  return {
    title: resolvedTitle,
    description,
    applicationName: siteConfig.siteName,
    authors: authors.map((name) => ({ name })),
    creator: siteConfig.author,
    publisher: siteConfig.author,
    keywords: [
      'Sharukh Rahman',
      'Data Science',
      'Software Engineer',
      'Machine Learning',
      'Domain-Driven Design',
      'Next.js',
      '.NET',
      'RAG',
      'Technical Blog',
      ...(tags ?? []),
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonical,
      title: socialTitle,
      description,
      siteName: siteConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            tags,
            authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
      creator: '@dev_SR',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    verification: {
      google: siteConfig.verification.google,
      other: siteConfig.verification.bing
        ? { 'msvalidate.01': siteConfig.verification.bing }
        : undefined,
    },
  };
}

export function getPersonSchema() {
  const skills = skillGroups.flatMap((group) => group.technologies);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: profile.name,
    url: siteConfig.url,
    image: absoluteUrl('/logo.svg'),
    email: profile.email,
    jobTitle: 'Data Science Student & Software Engineer',
    description: profile.bio,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Budapest',
      addressCountry: 'HU',
    },
    alumniOf: education.map((item) => ({
      '@type': 'EducationalOrganization',
      name: item.institution,
      address: item.place,
    })),
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: skills,
    award: publications.map((pub) => pub.title),
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.siteName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      '@id': `${siteConfig.url}/#person`,
    },
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.siteName,
    url: siteConfig.url,
    logo: absoluteUrl('/logo.svg'),
    sameAs: [profile.github, profile.linkedin],
    founder: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

type ArticleSchemaInput = {
  title: string;
  description?: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
  coverImage?: string;
  coverImageAlt?: string;
  readingTime?: number;
};

export function getArticleSchema(input: ArticleSchemaInput) {
  const url = absoluteUrl(input.path);
  const image = input.coverImage
    ? absoluteUrl(input.coverImage)
    : absoluteUrl(defaultOgImagePath(input.path));

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: input.title,
    description: input.description || siteConfig.description,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    keywords: input.tags?.join(', '),
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
      caption: input.coverImageAlt ?? input.title,
    },
    ...(input.readingTime
      ? {
          timeRequired: `PT${input.readingTime}M`,
        }
      : {}),
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
  };
}

type CourseLessonSchemaInput = {
  title: string;
  description?: string;
  path: string;
  courseSlug: string;
  courseTitle?: string;
  badge?: string;
};

export function getCourseLessonSchema(input: CourseLessonSchemaInput) {
  const url = absoluteUrl(input.path);
  const courseUrl = absoluteUrl(`/learn/${input.courseSlug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${url}#lesson`,
    name: input.title,
    headline: input.title,
    description: input.description || siteConfig.description,
    url,
    learningResourceType: 'Lesson',
    educationalLevel: 'Advanced',
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    isPartOf: {
      '@type': 'Course',
      name: input.courseTitle ?? input.courseSlug,
      url: courseUrl,
    },
    ...(input.badge ? { educationalUse: input.badge } : {}),
    image: absoluteUrl(defaultOgImagePath(input.path)),
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function getCollectionPageSchema(input: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      '@id': `${siteConfig.url}/#website`,
    },
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

export function getProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${profile.name} — Portfolio`,
    description: profile.bio,
    url: absoluteUrl('/portfolio'),
    mainEntity: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

export function getAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${profile.name}`,
    description: profile.bio,
    url: absoluteUrl('/about'),
    mainEntity: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

export function getWebApplicationSchema(input: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@id': `${siteConfig.url}/#person`,
    },
  };
}

export function getCourseCatalogSchema(
  courses: Array<{ title: string; description?: string; href: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Engineering Learn Catalog',
    description: 'Interactive system design and engineering guides by Sharukh Rahman.',
    url: absoluteUrl('/learn'),
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: course.title,
      url: absoluteUrl(course.href),
      description: course.description,
    })),
  };
}

export { absoluteUrl };
