import { Announcement } from "@/components/announcement";
import { Icons } from "@/components/icons";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function IndexPage() {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Shrink, Share, and Track URLs</PageHeaderHeading>
        <PageHeaderDescription>
          Create short links, share them, and track their performance. Get
          insights on your audience and optimize your marketing campaigns.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/dashboard" className={cn(buttonVariants())}>
            Get Started
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={config.links.github}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.github className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </PageActions>
      </PageHeader>
    </>
  );
}
