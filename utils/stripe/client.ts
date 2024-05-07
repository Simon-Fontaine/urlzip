import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripe: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripe) {
    stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");
  }

  return stripe;
};
