import Stripe from "stripe";
import { StripeProps } from "../types/stripe";

const stripe = new Stripe(process.env['STRIPE_KEY']!, {
  apiVersion: '2020-08-27',
  typescript: true
});

export const getStripeIndents = () => {
  return stripe.paymentIntents.create({
    amount: 50,
    currency: 'usd',
    payment_method_types: ['card']
  })
}

export const redirectPaymentStripe = (props: StripeProps) => {
  const { cancel_url, items, mode, success_url, options } = props;
  return stripe.checkout.sessions.create({
    success_url: success_url,
    cancel_url: cancel_url,
    payment_method_types: ['card'],
    line_items: items.map(item => {
      return {
        name: item.productId.title,
        amount: (item.productId.discount_price || item.productId.price) * 100,
        currency: 'usd',
        quantity: item.quantity,
        images: item.productId.images,
      }
    }),
    mode: mode || 'payment',
    ...(options || {})
  })
}
export default stripe;