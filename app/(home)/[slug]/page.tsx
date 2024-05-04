import { getPages } from "../utils";
import { CustomMDX } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";

export function generateStaticParams() {
  const pages = getPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Record<string, string>;
}) {
  const pages = getPages();
  const page = pages.find((page) => page.slug === params.slug);

  if (!page) {
    return;
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default function Page({ params }: { params: Record<string, string> }) {
  const pages = getPages();
  const page = pages.find((page) => page.slug === params.slug);

  if (!page) {
    return notFound();
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {page.data.title}
        </h1>
        {page.data.description && (
          <p className="text-lg text-muted-foreground">
            <Balancer>{page.data.description}</Balancer>
          </p>
        )}
      </div>
      <hr className="my-4" />
      <CustomMDX>{page.content}</CustomMDX>
    </article>
  );
}
