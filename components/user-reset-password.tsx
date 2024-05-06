"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userResetPasswordSchema } from "@/lib/validations/auth";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof userResetPasswordSchema>;

export function UserResetPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userResetPasswordSchema),
  });

  useEffect(() => {
    if (searchParams.get("error")) {
      toast({
        title: "Sorry, we weren't able to reset your password.",
        description: searchParams.get("error") || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }, []);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const supabase = createClient();

    const resetResult = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/recovery`,
    });

    console.log(resetResult);

    if (resetResult.error) {
      setIsLoading(false);

      return toast({
        title: "Something went wrong.",
        description: resetResult.error.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: "Password reset link sent to your email.",
    });

    setIsLoading(false);
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
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
}
