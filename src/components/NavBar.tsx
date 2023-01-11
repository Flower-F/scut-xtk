import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import LogoImage from '../../public/images/logo.png';

export function NavBar() {
  return (
    <div className='navbar bg-primary'>
      <div className='navbar-start w-full'>
        <Link href='/' className='rounded-md px-2'>
          <Image src={LogoImage} className='h-16 w-auto sm:h-20' alt='Logo' priority />
        </Link>
      </div>

      <div className='navbar-end hidden text-gray-100 lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <Link href='/'>首页</Link>
          </li>
          <li>
            <Link href='/xtk'>题库</Link>
          </li>
          <li>
            <Link href='/mine'>我的</Link>
          </li>
        </ul>
      </div>

      <div className='navbar-end lg:hidden'>
        <div className='dropdown-end dropdown'>
          <label tabIndex={0} className='btn-ghost btn'>
            <Bars3Icon className='h-6 w-6 text-gray-100' />
          </label>
          <ul className='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'>
            <li>
              <Link href='/'>首页</Link>
            </li>
            <li>
              <Link href='/xtk'>题库</Link>
            </li>
            <li>
              <Link href='/mine'>我的</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
