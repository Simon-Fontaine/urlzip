import { toDateTime } from "../helpers";
import type { Database, Tables, TablesInsert } from "@/types/supabase";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

type Product = Tables<"products">;
type Price = Tables<"prices">;

const TRIAL_PERIOD_DAYS = 0;

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

const supabase = createAdminClient();

export async function upsertProductRecord(product: Stripe.Product) {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabase.from("products").upsert([productData]);

  if (error) {
    throw new Error(`Failed to upsert product: ${error.message}`);
  }

  console.log(`Product upserted: ${product.id}`);
}

export async function upsertPriceRecord(
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) {
  const priceData: Price = {
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    id: price.id,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    metadata: price.metadata,
    product_id: typeof price.product === "string" ? price.product : "",
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
  };

  const { error } = await supabase.from("prices").upsert([priceData]);

  if (error?.message.includes("foreign key constraint")) {
    if (retryCount < maxRetries) {
      console.log(`Retrying upsert for price: ${price.id} (${retryCount + 1})`);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount, maxRetries);
    } else {
      throw new Error(
        `Failed to upsert price after ${maxRetries} retries: ${error.message}`,
      );
    }
  } else if (error) {
    throw new Error(`Failed to upsert price: ${error.message}`);
  } else {
    console.log(`Price upserted: ${price.id}`);
  }
}

export async function deleteProductRecord(product: Stripe.Product) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  console.log(`Product deleted: ${product.id}`);
}

export async function deletePriceRecord(price: Stripe.Price) {
  const { error } = await supabase.from("prices").delete().eq("id", price.id);

  if (error) {
    throw new Error(`Failed to delete price: ${error.message}`);
  }

  console.log(`Price deleted: ${price.id}`);
}

export async function upsertCustomerToSupabase(
  uuid: string,
  customerId: string,
) {
  const { error } = await supabase
    .from("customers")
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (error) {
    throw new Error(`Failed to upsert Supabase customer: ${error.message}`);
  }

  return customerId;
}

export async function createCustomerInStripe(uuid: string, email: string) {
  const data = { metadata: { supabaseUUID: uuid }, email: email };

  const customer = await stripe.customers.create(data);
  if (!customer) {
    throw new Error("Failed to create Stripe customer");
  }

  return customer.id;
}

export async function createOrRetrieveCustomer(uuid: string, email: string) {
  const { data: existingSupabaseCustomer, error } = await supabase
    .from("customers")
    .select()
    .eq("id", uuid)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch Supabase customer: ${error.message}`);
  }

  let stripeCustomerId: string | undefined;

  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );

    stripeCustomerId = existingStripeCustomer.id;
  } else {
    const stripeCustomers = await stripe.customers.list({ email });

    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  if (!stripeCustomerId) {
    stripeCustomerId = await createCustomerInStripe(uuid, email);
  }

  if (!stripeCustomerId) {
    throw new Error("Failed to create or retrieve Stripe customer");
  }

  if (existingSupabaseCustomer && stripeCustomerId) {
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: customerUpdateError } = await supabase
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", uuid);

      if (customerUpdateError)
        throw new Error(
          `Supabase customer record update failed: ${customerUpdateError.message}`,
        );

      console.warn(
        `Supabase customer ${uuid} updated with new Stripe customer ID: ${stripeCustomerId}`,
      );
    }

    return stripeCustomerId;
  } else {
    const newSupabaseCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeCustomerId,
    );

    console.warn(
      `Supabase customer ${uuid} upserted with Stripe customer ID: ${stripeCustomerId}`,
    );

    return newSupabaseCustomer;
  }
}

export async function copyBillingDetailsToCustomer(
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;

  if (!name || !phone || !address) return;
  // @ts-ignore - Address Typing
  await stripe.customers.update(customer, { name, phone, address });

  const { error } = await supabase
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);

  if (error) {
    throw new Error(`Failed to update user billing details: ${error.message}`);
  }
}

export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (customerError) {
    throw new Error(
      `Failed to fetch Supabase customer: ${customerError.message}`,
    );
  }

  const { id: uuid } = customerData;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  if (!subscription) {
    throw new Error("Failed to retrieve subscription");
  }

  const subscriptionData: TablesInsert<"subscriptions"> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert([subscriptionData]);

  if (subscriptionError) {
    throw new Error(
      `Failed to upsert subscription: ${subscriptionError.message}`,
    );
  }

  console.log(
    `Supabase customer ${uuid} subscription upserted: ${subscription.id}`,
  );

  if (createAction && subscription.default_payment_method && uuid) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
  }
}
