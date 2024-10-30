'use client';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './logo';
const MobileNavBar = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className='mobile-sidebar root-layout  '>
      {/* main logo */}
      <Logo imageSize={30} styleImage='mb-0' />

      <div className='mobile-links'>
        {/* side bar links */}
        <Sheet>
          <SheetTrigger>
            <Menu className='cursor-pointer' size={30} />
          </SheetTrigger>
          <SheetContent side='left' className='bg-white border-none '>
            <div className='flex flex-col items-start w-full gap-4'>
              {/* main logo */}
              <Logo
                imageSize={30}
                styleImage='mb-0'
                styleLink='cursor-pointer flex items-center gap-1 px-4 '
                isTitle={false}
                styleTitle='text-26 font-imb-plex-serif font-bold text-black-1'
              />
              {/* Personalion */}
              <div className='mobilenav-sheet '>
                <SheetClose asChild>
                  <nav className='flex flex-col items-start w-full h-full gap-y-4 text-white '>
                    {sidebarLinks.map((link) => {
                      const isActive =
                        pathname === link.route ||
                        pathname?.startsWith(`${link.route}/`);
                      return (
                        <SheetClose asChild key={link.route}>
                          <Link
                            href={link.route}
                            className={cn('mobilenav-sheet_close w-full  ', {
                              'bg-bank-gradient ': isActive,
                            })}
                          >
                            <Image
                              src={link.imgURL}
                              alt={link.label}
                              width={20}
                              height={20}
                              className={cn({
                                'brightness-[3] invert-0': isActive,
                              })}
                            />
                            <p
                              className={cn(
                                'text-16 font-semibold text-black-2 ',
                                {
                                  '!text-white': isActive,
                                },
                              )}
                            >
                              {link.label}
                            </p>
                          </Link>
                        </SheetClose>
                      );
                    })}
                    {/* TODO: ADD USER  */}
                    USER
                  </nav>
                </SheetClose>
                {/* TODO:FOOTER */}
                FOOTER
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};
export default MobileNavBar;
