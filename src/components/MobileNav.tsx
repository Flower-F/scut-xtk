import Link from 'next/link';

import { type SidebarNavItem } from '~/types/nav';
import { Icons } from '~/components/Icons';
import { Button } from '~/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/DropdownMenu';
import { ScrollArea } from '~/components/ui/ScrollArea';
import { cn } from '~/utils/common';

interface MobileNavProps {
  items?: SidebarNavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='-ml-4 text-base hover:bg-transparent focus:ring-0  focus:ring-offset-0 md:hidden'
        >
          <Icons.Logo className='mr-2 h-4 w-4' />
          <span className='font-bold'>Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={24} alignOffset={4} className='w-[300px] overflow-scroll'>
        <DropdownMenuItem asChild>
          <Link href='/' className='flex items-center'>
            <Icons.Logo className='mr-2 h-4 w-4' /> shadcn/ui
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ScrollArea className='h-[400px]'>
          {items?.length
            ? items.map(
                (item, index) =>
                  item.href && (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  )
              )
            : null}
          {items?.length
            ? items.map((item, index) => (
                <DropdownMenuGroup key={index}>
                  <DropdownMenuSeparator
                    className={cn({
                      hidden: index === 0,
                    })}
                  />
                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                  <DropdownMenuSeparator className='-mx-2' />
                  {item.items.length &&
                    item.items.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
              ))
            : null}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
