import Stripe from "stripe";
import { CartPropsPopulate } from "./user";

export interface StripeProps {
  success_url: string;
  cancel_url: string;
  mode?: Stripe.Checkout.SessionCreateParams.Mode;
  items: Array<CartPropsPopulate>;
  options?: Stripe.Checkout.SessionCreateParams
}