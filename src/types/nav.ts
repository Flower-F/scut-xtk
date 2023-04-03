import { type Icons } from '~/components/Icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  /** whether the link is an external link */
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;

  /** a unique symbol*/
  slug?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export type MainNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;
