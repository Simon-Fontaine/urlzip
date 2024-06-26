import { config } from "@/config";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} {config.name}. All rights
            reserved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href={config.links["privacy-policy"]} className="text-sm">
            Privacy Policy
          </Link>
          <Link href={config.links["terms-of-service"]} className="text-sm">
            Terms of Service
          </Link>
          <Link href={config.links["cookie-policy"]} className="text-sm">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
