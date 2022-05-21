import { RequestHandler } from "express";
import { Types } from 'mongoose';
import { validationResult } from "express-validator";
import { CASH } from "../constants/field";
import Order from "../models/Order";
import User from '../models/User';
import { StripeProps } from "../types/stripe";
import { CartPropsPopulate } from "../types/user";
import { getStripeIndents, redirectPaymentStripe } from "../utils/stripe";
import Product from "../models/Product";
import {ProductPopulateID } from "../types/product";

export const getPaymentInitController: RequestHandler = async (req, res, next) => {
  try{
    const paymentInfo = await getStripeIndents();
    res.json({
      message: 'successfully',
      client_secret: paymentInfo.client_secret,
      code: 200
    });
  }catch(err) {
    next(err);
  }
}

export const paymentRedirectCheckout: RequestHandler = async (req, res, next) => {
  const { cancel_url, success_url } = req.body as StripeProps;
  try{
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      return res.status(422).json({
        message: validate.array()[0].msg,
        code: 422,
        errors: validate.array()
      })
    };
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthenticated',
        code: 401
      })
    };
    const user = await User.findById(req.userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({
        message: 'Not Found',
        code: 404
      })
    };
    const cartUser = user.cart as unknown as Array<CartPropsPopulate>;
    const getStripeInfo = await redirectPaymentStripe({
      cancel_url: cancel_url,
      success_url: success_url, 
      items: cartUser
    });

    res.json({
      message: 'successfully',
      code: 200,
    })
    console.log(getStripeInfo);

  }catch(err) {
    next(err);
  }
};

export const validateOrderPayment: RequestHandler = async (req, res, next) => {
  const id = req.params['id'];
  const type = req.query['type'];
  try{
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(401).json({
        message: validation.array()[0].msg,
        code: 401
      })
    };
    let objectFind;
    if (type === CASH) {
      objectFind = {
        _id: new Types.ObjectId(id)
      }
    } else {
      objectFind = {
        stripe_key: id
      }
    };
    const findOrder = await Order.findOne(objectFind).populate([
      'object_info_id',
      'items.product_id'
    ]);
    if (!findOrder) {
      return res.status(404).json({
        message: 'Order is not existed',
        code: 404
      })
    };
    const items = findOrder.items as unknown as Array<ProductPopulateID>;
    const itemIsValid = items.some(value => value.product_id.stock_quantity - value.quantity > 0);
    if (!itemIsValid) {
      return res.status(400).json({
        message: 'Process is not valid',
        code: 400
      })
    };
    await Product.bulkWrite(items!.map((item) => {
      const { stock_quantity, _id } = item.product_id;
      const { quantity } = item;
      return {
        updateOne: {
          filter: {_id: _id},
          update: {
            stock_quantity: stock_quantity - quantity
          }
        }
      }
    }));
    const user = await User.findById(req.userId);
    await user?.resetCartUser();
    findOrder.is_paid = true;
    if (findOrder.stripe_key) {
      findOrder.stripe_key = undefined;
    }
    await findOrder.save();
    res.json({
      message: 'Successfully',
      code: 200,
      data: findOrder
    })

  }catch(err){
    next(err);
  }
};
