"use server";

import { calculateTrialEnd, generateURL } from "../helpers";
import { Tables } from "@/types/supabase";
import { stripe } from "@/utils/stripe/config";
import { createOrRetrieveCustomer } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

type Price = Tables<"prices">;

type CheckoutResponse = {
  error?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = "/dashboard/account",
): Promise<CheckoutResponse> {
  try {
    const supabase = createClient();

    const {
      error: customerError,
      data: { user },
    } = await supabase.auth.getUser();

    if (customerError || !user) {
      console.error(`Error fetching user: ${customerError?.message}`);
      throw new Error("Could not get user session.");
    }

    let customer: string;

    try {
      customer = await createOrRetrieveCustomer(user.id, user.email || "");
    } catch (error) {
      console.error(`Error upserting customer: ${error}`);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      consent_collection: {
        terms_of_service: "required",
      },
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: generateURL(),
      success_url: generateURL(redirectPath),
    };

    console.log(`Trial end: ${calculateTrialEnd(price.trial_period_days)}`);

    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEnd(price.trial_period_days),
        },
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }

    let session: Stripe.Checkout.Session | undefined;

    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (error) {
      console.error(`Error creating checkout session: ${error}`);
      throw new Error("Unable to create checkout session.");
    }

    if (session) {
      return {
        sessionId: session.id,
      };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "An unknown error occurred.",
      };
    }
  }
}
