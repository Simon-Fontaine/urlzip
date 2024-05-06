import { Icons } from "./components/icons";
import { LucideIcon } from "lucide-react";
import { version } from "os";

interface NavigationItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
}

const name = "URLzip";

export const config = {
  name: name,
  version: "0.0.0",
  url: "https://urlzip.xyz",
  description: `${name} is a free and open-source URL shortener that allows you to shrink, share, and track URLs. 
  Get insights on your audience and optimize your marketing campaigns.`,
  links: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
    "cookie-policy": "/cookie-policy",
    github: "https://github.com/Simon-Fontaine/urlzip",
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
    title: "Updates",
    href: "/updates",
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
