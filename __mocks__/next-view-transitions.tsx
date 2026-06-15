import React from 'react';

export function Link({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={href} {...props}>{children}</a>;
}

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
