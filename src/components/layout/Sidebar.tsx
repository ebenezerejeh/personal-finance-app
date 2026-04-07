'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { useSidebarStore } from '@/src/store/sidebarStore';

const NAV_ITEMS = [
  { label: 'Overview', href: '/overview', icon: '/icon-nav-overview.svg' },
  { label: 'Transactions', href: '/transactions', icon: '/icon-nav-transactions.svg' },
  { label: 'Budgets', href: '/budgets', icon: '/icon-nav-budgets.svg' },
  { label: 'Pots', href: '/pots', icon: '/icon-nav-pots.svg' },
  { label: 'Recurring Bills', href: '/recurring-bills', icon: '/icon-nav-recurring-bills.svg' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-grey-900 rounded-tr-2xl rounded-br-2xl',
          'transition-all duration-300 ease-in-out shrink-0',
          collapsed ? 'w-[88px]' : 'w-[300px]'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center px-8 pt-10 pb-6',
            collapsed && 'justify-center px-4'
          )}
        >
          {collapsed ? (
            <Image src="/logo-small.svg" alt="finance" width={22} height={22} />
          ) : (
            <Image src="/logo-large.svg" alt="finance" width={122} height={22} />
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 mt-6 pr-6">
          {NAV_ITEMS.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-4 rounded-r-2xl py-4 pr-6',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-beige-100 border-l-4 border-green pl-7'
                    : 'pl-8',
                  collapsed && 'justify-center pl-0 pr-0 px-4 border-l-0'
                )}
              >
                <span
                  className={cn(
                    'shrink-0 block size-6 transition-[background-color] duration-150',
                    isActive ? 'bg-green' : 'bg-grey-300 group-hover:bg-white'
                  )}
                  style={{
                    WebkitMaskImage: `url(${icon})`,
                    maskImage: `url(${icon})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />

                {!collapsed && (
                  <span
                    className={cn(
                      'text-preset-3 font-bold leading-preset-3 whitespace-nowrap',
                      isActive ? 'text-grey-900' : 'text-grey-300 group-hover:text-white'
                    )}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Minimize button */}
        <button
          onClick={toggle}
          className={cn(
            'flex items-center gap-4 px-8 py-8 text-grey-300 hover:text-white transition-colors',
            collapsed && 'justify-center px-4'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          <Image
            src="/icon-minimize-menu.svg"
            alt=""
            width={24}
            height={24}
            className={cn(
              'shrink-0 filter-[brightness(0)_invert(1)] opacity-60 hover:opacity-100 transition-all',
              collapsed && 'rotate-180'
            )}
          />
          {!collapsed && (
            <span className="text-preset-3 font-bold leading-preset-3">
              Minimize Menu
            </span>
          )}
        </button>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end bg-grey-900 rounded-tl-2xl rounded-tr-2xl px-4 pt-2 pb-0">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 flex-1 pt-2 pb-4 px-2',
                'rounded-tl-xl rounded-tr-xl transition-colors',
                isActive ? 'bg-beige-100' : ''
              )}
            >
              <span
                className={cn(
                  'shrink-0 block size-6',
                  isActive ? 'bg-green' : 'bg-grey-300'
                )}
                style={{
                  WebkitMaskImage: `url(${icon})`,
                  maskImage: `url(${icon})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
              {isActive && (
                <span className="text-preset-5 font-bold text-grey-900 leading-none">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
