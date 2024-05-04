import AuthButton from "./auth-button";
import { Icons } from "./icons";
import { NavDesktop } from "./nav-desktop";
import { NavMobile } from "./nav-mobile";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <NavDesktop />
        <NavMobile />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex w-auto flex-none items-center">
            <Link href={config.links.github} target="_blank" rel="noreferrer">
              <Button variant="ghost">
                <Icons.github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href={config.links.twitter} target="_blank" rel="noreferrer">
              <Button variant="ghost">
                <Icons.twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
            <ModeToggle />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
