import { Link } from '@tanstack/react-router';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

export function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 [&.active]:bg-white [&.active]:text-slate-900 [&.active]:shadow-sm dark:[&.active]:bg-slate-800 dark:[&.active]:text-slate-100"
      activeProps={{ className: 'active' }}
    >
      {children}
    </Link>
  );
}
