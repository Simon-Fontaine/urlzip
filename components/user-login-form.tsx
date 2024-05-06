"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userLoginSchema } from "@/lib/validations/auth";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof userLoginSchema>;

export function UserLoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userLoginSchema),
  });

  useEffect(() => {
    if (searchParams.get("error")) {
      toast({
        title: "Sorry, we weren't able to log you in.",
        description: searchParams.get("error") || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }, []);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const supabase = createClient();

    const signInResult = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInResult.error) {
      setIsLoading(false);

      return toast({
        title: "Something went wrong.",
        description: signInResult.error.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: "You have successfully logged in.",
    });

    router.refresh();

    setIsLoading(false);

    return router.push(searchParams.get("redirect_to") || "/dashboard");
  }

  async function signInWithDiscord() {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isDiscordLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading || isDiscordLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsDiscordLoading(true);
          signInWithDiscord();
        }}
        disabled={isLoading || isDiscordLoading}
      >
        {isDiscordLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.discord className="mr-2 h-4 w-4" />
        )}{" "}
        Discord
      </button>
    </div>
  );
}
