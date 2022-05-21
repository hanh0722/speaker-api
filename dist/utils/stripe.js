"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectPaymentStripe = exports.getStripeIndents = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env['STRIPE_KEY'], {
    apiVersion: '2020-08-27',
    typescript: true
});
const getStripeIndents = () => {
    return stripe.paymentIntents.create({
        amount: 50,
        currency: 'usd',
        payment_method_types: ['card']
    });
};
exports.getStripeIndents = getStripeIndents;
const redirectPaymentStripe = (props) => {
    const { cancel_url, items, mode, success_url, options } = props;
    return stripe.checkout.sessions.create(Object.assign({ success_url: success_url, cancel_url: cancel_url, payment_method_types: ['card'], line_items: items.map(item => {
            return {
                name: item.productId.title,
                amount: (item.productId.discount_price || item.productId.price) * 100,
                currency: 'usd',
                quantity: item.quantity,
                images: item.productId.images,
            };
        }), mode: mode || 'payment' }, (options || {})));
};
exports.redirectPaymentStripe = redirectPaymentStripe;
exports.default = stripe;
