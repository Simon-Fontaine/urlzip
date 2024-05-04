import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();

    await supabase.auth.signOut();
    return redirect(`/login`);
  };

  return user ? (
    <div className="ml-2 flex items-center gap-4">
      <form action={signOut}>
        <Button variant="secondary" size="sm" className="px-4">
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "ml-2 px-4",
      )}
    >
      Login
    </Link>
  );
}
