'use client';
import {sidebarLinks} from '@/constants';
import {cn} from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import PlaidLink from '../banks/plaid-link';
import Logo from './logo';
import SideBarFooter from './sideBarFooter';

function SideBar({user}: SideBarProps) {
  const pathname = usePathname();
  return (
    // todo: fix the overflow
    <section className="sidebar  z-50 ">
      <nav className="flex flex-col gap-4">
        {/* main logo */}
        <Logo styleLink="mb-12" />

        {/* side bar links */}
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route || pathname?.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn('sidebar-link', {
                'bg-bank-gradient ': isActive,
              })}
            >
              <div className="relative size-6">
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({
                    'brightness-[3] invert-0': isActive,
                  })}
                />
              </div>
              <p
                className={cn('sidebar-label', {
                  '!text-white': isActive,
                })}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        {/* user profile */}
        <PlaidLink user={user} />
      </nav>
      {/* sidebar  footer */}
      <SideBarFooter user={user} type="desktop" />
    </section>
  );
}

export default SideBar;
