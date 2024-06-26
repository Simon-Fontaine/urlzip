import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserLoginForm } from "@/components/user-login-form";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UserLoginForm />
        </Suspense>
        <p className="flex flex-col gap-2 px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/reset-password"
            className="hover:text-brand underline underline-offset-4"
          >
            Lost your password? Reset it
          </Link>
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
