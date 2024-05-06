"use client";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { userUpdatePasswordSchema } from "@/lib/validations/auth";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof userUpdatePasswordSchema>;

export function UserUpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userUpdatePasswordSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const supabase = createClient();

    const updateResult = await supabase.auth.updateUser({
      password: data.password,
    });

    console.log(updateResult);

    if (updateResult.error) {
      setIsLoading(false);

      return toast({
        title: "Something went wrong.",
        description: updateResult.error.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Success",
      description: "Your password has been updated.",
    });

    router.refresh();

    setIsLoading(false);

    return router.push(searchParams.get("redirect_to") || "/dashboard");
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Confirm Password
            </Label>
            <Input
              id="passwordConfirmation"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("passwordConfirmation")}
            />
            {errors?.passwordConfirmation && (
              <p className="px-1 text-xs text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
