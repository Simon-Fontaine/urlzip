import { RevealBento } from "@/components/bento-grid";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { config } from "@/config";

export default async function AboutPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>About {config.name}</PageHeaderHeading>
        <PageHeaderDescription>{config.description}</PageHeaderDescription>
      </PageHeader>
      <RevealBento />
    </>
  );
}
