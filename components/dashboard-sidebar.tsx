"use client";

import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { config, dashboardNavigation } from "@/config";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  const lastItem = dashboardNavigation[dashboardNavigation.length - 1];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Icons.logo className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">{config.name}</span>
          </Link>
          {dashboardNavigation.map(
            (item, index) =>
              item.href &&
              item.icon &&
              index !== dashboardNavigation.length - 1 && (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                        pathname.endsWith(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ),
          )}
        </nav>
        {lastItem.href && lastItem.icon && (
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={lastItem.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <lastItem.icon className="h-5 w-5" />
                  <span className="sr-only">{lastItem.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{lastItem.title}</TooltipContent>
            </Tooltip>
          </nav>
        )}
      </TooltipProvider>
    </aside>
  );
}
