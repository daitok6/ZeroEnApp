import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe =
  stripeSecretKey && stripeSecretKey !== 'sk_test_placeholder'
    ? new Stripe(stripeSecretKey, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiVersion: '2026-03-25.dahlia' as any,
        typescript: true,
      })
    : null;
