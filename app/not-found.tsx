"use client";

import { Icons } from "@/components/icons";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const backHref = pathname.replace(/\/[^/]*$/, "/");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <PageHeader>
        <PageHeaderHeading>404 - Page Not Found</PageHeaderHeading>
        <PageHeaderDescription>
          Please check the URL in the address bar and try again.
        </PageHeaderDescription>
        <PageActions>
          <Link href={backHref} className={cn(buttonVariants(), "group")}>
            <Icons.chevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to previous page
          </Link>
        </PageActions>
      </PageHeader>
    </div>
  );
}
