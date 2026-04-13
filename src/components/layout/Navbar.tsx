'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, Plus, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';
import LanguageSelector from '@/components/ui/LanguageSelector';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/boutique', label: t('nav.boutique') },
    { href: '/teleconsultation', label: t('nav.teleconsultation') },
    { href: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenus}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Plus className="h-5 w-5" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-secondary-900">
              MEDICO<span className="text-primary-600">PLACE</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSelector />
            <Link href="/panier" className="relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    <Link href="/tableau-de-bord" onClick={closeMenus} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4" /> {t('nav.dashboard')}
                    </Link>
                    <Link href="/tableau-de-bord/profil" onClick={closeMenus} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4" /> {t('nav.profile')}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { closeMenus(); logout(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/connexion" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">{t('nav.login')}</Link>
                <Link href="/inscription" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <Link href="/panier" className="relative rounded-lg p-2 text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">{totalItems}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenus}
                  className={cn('rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >{link.label}</Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {isAuthenticated ? (
                <>
                  <Link href="/tableau-de-bord" onClick={closeMenus} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">{t('nav.dashboard')}</Link>
                  <button onClick={() => { closeMenus(); logout(); }} className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">{t('nav.logout')}</button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link href="/connexion" onClick={closeMenus} className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700">{t('nav.login')}</Link>
                  <Link href="/inscription" onClick={closeMenus} className="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white">{t('nav.register')}</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenus}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Plus className="h-5 w-5" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-secondary-900">
              MEDICO<span className="text-primary-600">PLACE</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/panier" className="relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    <Link href="/tableau-de-bord" onClick={closeMenus} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4" /> Tableau de bord
                    </Link>
                    <Link href="/tableau-de-bord/profil" onClick={closeMenus} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4" /> Mon profil
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { closeMenus(); logout(); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/connexion" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Connexion</Link>
                <Link href="/inscription" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">Inscription</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/panier" className="relative rounded-lg p-2 text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">{totalItems}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-100 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeMenus}
                  className={cn('rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >{link.label}</Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {isAuthenticated ? (
                <>
                  <Link href="/tableau-de-bord" onClick={closeMenus} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Tableau de bord</Link>
                  <button onClick={() => { closeMenus(); logout(); }} className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Déconnexion</button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link href="/connexion" onClick={closeMenus} className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700">Connexion</Link>
                  <Link href="/inscription" onClick={closeMenus} className="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white">Inscription</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
