'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Calendar, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const sidebarLinks = [
    { href: '/tableau-de-bord', label: t('dashboard.sidebar.dashboard'), icon: LayoutDashboard },
    { href: '/tableau-de-bord/rendez-vous', label: t('dashboard.sidebar.appointments'), icon: Calendar },
    { href: '/tableau-de-bord/historique', label: t('dashboard.sidebar.history'), icon: Clock },
    { href: '/tableau-de-bord/profil', label: t('dashboard.sidebar.profile'), icon: User },
  ];

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <nav className="card-premium p-3">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <link.icon className="h-4 w-4" /> {link.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-100" />
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
            <LogOut className="h-4 w-4" /> {t('dashboard.sidebar.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
}
