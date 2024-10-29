import Link from 'next/link';

function SideBar({ user }: SideBarProps) {
  return (
    <section className='sidebar '>
      <nav className='flex flex-col gap-4'>
        <Link
          href='/dashboard'
          className='sidebar-logo flex items-center justify-center gap-3'
        ></Link>
      </nav>
    </section>
  );
}

export default SideBar;
