import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your public key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
