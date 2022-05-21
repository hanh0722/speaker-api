import { body, param } from "express-validator";
import Address from "../models/Address";
import Order from "../models/Order";

export const validationOrder = [
  body("payment_methods")
    .not()
    .isEmpty()
    .withMessage("Payment method is not valid, please choose payment method"),
  body("delivery_methods")
    .not()
    .isEmpty()
    .withMessage("Delivery method is not valid, please choose delivery method"),
  body("object_info_id")
    .not()
    .isEmpty()
    .withMessage(
      "Information is not valid, please fill information form before checking out"
    )
    .custom(async (addressId, { req }) => {
      const address = await Address.findById(addressId);
      if (!address) {
        return Promise.reject("Address is not valid");
      }
      return true;
    }),
  body("success_url").not().isURL().withMessage("Success URL is required"),
  body("cancel_url").not().isURL().withMessage("Cancel URL is required"),
];

export const validationDeleteOrder = [
  param("redirect_id")
    .not()
    .isEmpty()
    .withMessage("Stripe ID must be allowed")
    .custom(async (id, { req }) => {
      try {
        const order = await Order.findOne({ stripe_key: id });
        if (!order) {
          return Promise.reject("Order is not valid");
        }
        return true;
      } catch (err) {
        return Promise.reject("Unauthenticated");
      }
    }),
];
