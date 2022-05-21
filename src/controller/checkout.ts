import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { CASH } from "../constants/field";
import Address from "../models/Address";
import Order from "../models/Order";
import User from "../models/User";
import { CreateCheckoutRequest } from "../types/order";
import { CartPropsPopulate } from "../types/user";
import { mapProductOrder } from "../utils/response";
import { randomNumber } from "../utils/string";
import { redirectPaymentStripe } from "../utils/stripe";

export const onCheckoutController: RequestHandler = async (req, res, next) => {
  const {
    payment_methods,
    delivery_methods,
    object_info_id,
    cancel_url,
    success_url,
  } = req.body as CreateCheckoutRequest;

  try {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      return res.status(422).json({
        message: validate.array()[0].msg,
        code: 422,
        errors: validate.array(),
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        message: "Unauthenticated",
        code: 401,
      });
    }
    const addressUser = await Address.findById(object_info_id);
    const user = await User.findById(req.userId).populate("cart.productId");
    if (!addressUser || !user) {
      return res.status(404).json({
        message: "Not valid information",
        code: 404,
      });
    }
    const cartUser = user.cart as unknown as Array<CartPropsPopulate>;
    if (cartUser.length === 0) {
      return res.status(422).json({
        message: 'Your cart is empty!',
        code: 422
      })
    }
    const orderItems = mapProductOrder(cartUser);
    randomNumber(async (id) => {
      const order = new Order({
        object_id: req.userId,
        object_info_id: addressUser._id,
        delivery_methods: delivery_methods,
        payment_methods: payment_methods,
        items: orderItems,
        stripe_key: payment_methods === CASH ? undefined : id
      });
      user.orders.push(order._id);
      await user.save();
      await order.save();
      if (payment_methods === CASH) {
        return res.json({
          message: 'successfully',
          code: 200,
          order_id: order._id
        })
      };
      const stripeRedirect = await redirectPaymentStripe({
        success_url: `${success_url}?redirect_id=${id}`,
        cancel_url: `${cancel_url}?redirect_id=${id}`,
        items: cartUser,
      });
      return res.json({
        message: 'successfully',
        code: 200,
        data: {
          redirect_url: stripeRedirect.url
        }
      })
    });
    
  } catch (err) {
    next(err);
  }
};

export const onDeleteOrderErrorController: RequestHandler = async (req, res, next) => {
  const redirectId = req.params['redirect_id'];
  if (!redirectId) {
    return res.status(422).json({
      message: 'Order is not valid',
      code: 422
    })
  };
  try{
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422
      })
    };
    const result = await Order.deleteOne({ stripe_key: redirectId });
    console.log(result);
    res.json({
      message: 'successfully',
      code: 200
    })

  }catch(err) {
    next(err);
  }
}