import Link from 'next/link';
import Breadcrumb  from '@/components/breadcrumb';

export interface NavItem {
  name: string;
}

export function Navbar(NavItems: Record<string, NavItem>) {

  return (
    <aside className="-ml-[8px] mb-4 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(NavItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
                >
                  {name}
                </Link>
              );
            })}
          </div>
          <Breadcrumb />
        </nav>
      </div>
    </aside>
  );
}
