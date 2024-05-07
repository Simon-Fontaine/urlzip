"use client";

import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/supabase";
import { getStripe } from "@/utils/stripe/client";
import { checkoutWithStripe } from "@/utils/stripe/server";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Subscription = Tables<"subscriptions">;
type Product = Tables<"products">;
type Price = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = "lifetime" | "year" | "month";

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );

  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [selectedPrice, setSelectedPrice] = useState<string>();

  const handleStripeCheckout = async (price: Price) => {
    setSelectedPrice(price.id);

    if (!user) {
      setSelectedPrice(undefined);
      router.push(`/login?redirect=${currentPath}`);
    }

    const { error, sessionId } = await checkoutWithStripe(price, currentPath);

    if (error) {
      setSelectedPrice(undefined);
      return console.error(`Error creating checkout session: ${error}`);
    }

    if (!sessionId) {
      setSelectedPrice(undefined);
      return console.error("No session ID returned from Stripe.");
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setSelectedPrice(undefined);
  };

  function formatCurrency(amount: number = 0, currency: string = "EUR") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);
  }

  return (
    <section>
      <div className="sm:align-center sm:flex sm:flex-col">
        <Card className="relative flex self-center">
          {intervals.includes("month") && (
            <Button
              onClick={() => setBillingInterval("month")}
              variant={billingInterval === "month" ? "default" : "ghost"}
              className="relative m-1 w-1/2 py-2"
            >
              Monthly billing
            </Button>
          )}
          {intervals.includes("year") && (
            <Button
              onClick={() => setBillingInterval("year")}
              variant={billingInterval === "year" ? "default" : "ghost"}
              className="relative m-1 w-1/2 py-2"
            >
              Yearly billing
            </Button>
          )}
        </Card>
      </div>
      <div className="mt-16 flex flex-wrap justify-center gap-6">
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>
              5 custom aliases, 30 shortened URLs, 10 second redirection delay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mt-8">
              <span className="text-5xl font-extrabold">
                {formatCurrency(0)}
              </span>
              <span className="text-base font-medium">/{billingInterval}</span>
            </p>
            <Link
              href={`/dashboard${subscription ? "/billing" : ""}`}
              type="button"
              className={cn(
                "mt-8 block w-full py-2",
                buttonVariants({ variant: "default" }),
              )}
            >
              {subscription ? "Manage" : "Subscribe"}
            </Link>
          </CardContent>
        </Card>
        {products.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval,
          );
          if (!price) return null;
          return (
            <Card
              key={product.id}
              className={cn("max-w-xs", {
                "border border-primary": subscription
                  ? product.name === subscription?.prices?.products?.name
                  : product.name === "Pro",
              })}
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mt-8">
                  <span className="text-5xl font-extrabold">
                    {formatCurrency(
                      price.unit_amount || 0,
                      price.currency || "EUR",
                    )}
                  </span>
                  <span className="text-base font-medium">
                    /{billingInterval}
                  </span>
                </p>
                <Button
                  type="button"
                  disabled={selectedPrice === price.id}
                  onClick={() => handleStripeCheckout(price)}
                  className="mt-8 block w-full py-2"
                >
                  {subscription ? "Manage" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
