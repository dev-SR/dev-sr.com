import { ViewTransition } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{
        'post-open': 'page-post-open',
        'nav-forward': 'page-forward',
        'nav-back': 'page-back',
        default: 'page-soft',
      }}
      exit={{
        'post-open': 'page-post-open',
        'nav-forward': 'page-forward',
        'nav-back': 'page-back',
        default: 'page-soft',
      }}>
      <div className="page-transition-shell">{children}</div>
    </ViewTransition>
  );
}
