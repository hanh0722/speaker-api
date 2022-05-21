import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import Address from "../models/Address";
import User from '../models/User';
import { AddressUser } from "../types/address";
import { SortBaseRequest } from "../types/base";
import { generateRegexFindObject, generateSortObject } from "../utils/query";

export const createAddressController: RequestHandler = async (req, res, next) => {
  const { address, city, country, full_name, is_default, phone_number, place, zip_code } = req.body as AddressUser;
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
        message: 'unauthenticated',
        code: 401
      })
    };
    const newAddress = new Address({
      object_id: req.userId,
      info: {
        city,
        country,
        full_name,
        is_default,
        phone_number,
        place,
        zip_code,
        address
      }  
    });
    if (is_default) {
      await Address.updateMany({'info.is_default': true}, {$set: {"info.is_default": false}});
    }
    const user = await User.findById(req.userId);
    console.log(user);
    user?.address.push(newAddress._id);
    await user?.save();
    await newAddress.save();
    res.json({
      message: 'successfully',
      code: 200,
      data: newAddress
    })
  }catch(err) {
    next(err);
  }
};

export const getAddressController: RequestHandler = async (req, res, next) => {
  const { sort, key, page = PAGE_DEFAULT, page_size = PAGE_SIZE, query, value } = req.query as SortBaseRequest;

  try{
    if (!req.userId) {
      return res.status(401).json({
        message: 'unauthenticated',
        code: 401
      })
    };
    const sortObject = generateSortObject(key, sort);
    const filterObject = generateRegexFindObject(query, value);
    const findAddress = await Address.find({...filterObject, object_id: req.userId}).sort({
      ...sortObject,
      'info.is_default': -1
    }).skip((+page - 1) * +page_size).limit(page_size)
    const totalDocuments = await Address.find({...filterObject, object_id: req.userId}).countDocuments();
    res.json({
      message: 'successfully',
      code: 200,
      total_documents: totalDocuments,
      data: findAddress
    })
  }catch(err) {
    next(err);
  }
}