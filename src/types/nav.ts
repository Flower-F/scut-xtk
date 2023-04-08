import { type Icons } from '~/components/Icons';

export interface NavItem {
  id: string;
  /** a unique symbol to identify the navItem's href information */
  slug?: string;
  name: string;
  disabled?: boolean;
  /** whether the link is an external link */
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string | null;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export type MainNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;
