import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserUpdatePasswordForm } from "@/components/user-update-password";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Update your account password",
};

export default async function UpdatePasswordPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?redirect_to=/login/update-password");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Update Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password to update your account
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UserUpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
