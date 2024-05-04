"use client";

import { URLzipLogo } from "./urlzip-logo";
import { navigation } from "@/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavDesktop() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <URLzipLogo href={"/"} />
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navigation.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname.endsWith(item.href)
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ),
        )}
      </nav>
    </div>
  );
}
