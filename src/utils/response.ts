import { Types } from "mongoose";
import { FIELD_FILTER } from "../constants/field";
import { CartPropsPopulate, UserHandler } from "../types/user";
import User from "../models/User";
import { ProductHandler, ProductProps } from "../types/product";
export const getUserResponse = (user: UserHandler) => {
  try {
    const parsedUser = Object.entries(user?._doc);
    const mapData = parsedUser.reduce((acc: any, [key, value]) => {
      const dataIsNotValid = FIELD_FILTER.some((field) => field === key);
      if (!dataIsNotValid) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});
    return mapData;
  } catch (err) {
    return user;
  }
};

export const getFieldOfUser = async (userId?: string) => {
  if (!userId) {
    return null;
  }
  try {
    const user = await User.findById(userId).populate(["compare_list"]);
    if (!user) {
      return null;
    }
    return user;
  } catch (err: any) {
    throw new Error(err?.message);
  }
};

export const mapProductOrder = (
  items: Array<CartPropsPopulate>
): Array<ProductProps<Types.ObjectId>> => {
  // @ts-ignore
  return items.map(item => {
    const { title, collections, description, images, price, discount_price = undefined, _id } = item.productId;
    const collectionObjectId = new Types.ObjectId(collections._id);
    return {
      title: title,
      collections: collectionObjectId,
      description: description,
      images: images,
      price: price, 
      discount_price: discount_price,
      quantity: item.quantity,
      product_id: _id
    }
  })
};
