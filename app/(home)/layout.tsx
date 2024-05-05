import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import Transition from "@/components/transition";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Transition>{children}</Transition>
      </main>
      <SiteFooter />
    </div>
  );
}
