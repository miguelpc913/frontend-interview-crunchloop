import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface NavLinkProps {
  to: '/' | '/dashboard';
  children: ReactNode;
}

export function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-background [&.active]:text-foreground [&.active]:shadow-sm"
      activeProps={{ className: 'active' }}
    >
      {children}
    </Link>
  );
}
