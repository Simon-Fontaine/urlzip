import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserRegisterForm } from "@/components/user-register-form";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Login
        <Icons.chevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
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
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <UserRegisterForm />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href={config.links["terms-of-service"]}
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href={config.links["privacy-policy"]}
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
