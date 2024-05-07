import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import Pricing from "@/components/pricing-table";
import { config } from "@/config";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export default async function PricingPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"])
    .maybeSingle();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  if (subscriptionError)
    console.error(`Error fetching subscription: ${subscriptionError.message}`);
  if (productsError)
    console.error(`Error fetching products: ${productsError.message}`);

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Pricing Plans</PageHeaderHeading>
        <PageHeaderDescription>
          Choose between our 3 monthly or yearly plans. Cancel anytime. Increase
          your account limits by upgrading your plan.
        </PageHeaderDescription>
      </PageHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <Pricing
          user={user}
          products={products || []}
          subscription={subscription}
        />
      </Suspense>
    </>
  );
}
