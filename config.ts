import { Icons } from "./components/icons";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
}

export const config = {
  name: "URLzip",
  url: "https://urlzip.xyz",
  description: "Easily shorten URLs and share them with others.",
  links: {
    github: "https://github.com/",
    discord: "https://discord.com/",
    twitter: "https://twitter.com/",
  },
};

export const navigation: NavigationItem[] = [
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Statistics",
    href: "/statistics",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Icons.home,
  },
  {
    title: "Shorten URL",
    href: "/dashboard/shorten",
    icon: Icons.link,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: Icons.analytics,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: Icons.billing,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Icons.settings,
  },
];
