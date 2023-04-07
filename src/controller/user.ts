import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import User from "../models/User";
import { PostUpdateUser, SearchUserQuery } from "../types/user";
import { generateRegexFindObject, generateSortObject } from "../utils/query";
import { getUserResponse } from "../utils/response";

export const searchUserController: RequestHandler = async (req, res, next) => {
  const {
    page = PAGE_DEFAULT,
    page_size = PAGE_SIZE,
    query,
    sort,
    value,
    key,
    s,
  } = req.query as SearchUserQuery;
  try {
    const searchRegex = new RegExp(`.*${s || ""}.*`);
    const sortObject = generateSortObject(key, sort);
    const filterObject = generateRegexFindObject(query, value);
    
    const querySearchUser = {
      name: { $regex: searchRegex, $options: "i" },
      _id: { $ne: req.userId },
      ...filterObject,
    };
    const user = await User.find(querySearchUser)
      .sort(sortObject)
      .skip((+page - 1) * +page_size)
      .limit(+page_size);

    const filterDataUser = user.map(u => getUserResponse(u));

    const totalUserMatching = await User.find(querySearchUser).countDocuments();
    res.json({
      message: "successfully",
      code: 200,
      data: filterDataUser,
      total_users: totalUserMatching
    });
  } catch (err) {
    next(err);
  }
};

export const updateInfoUserController: RequestHandler = (req, res, next) => {
  const { company, country, avatar_url,  } = req.body as PostUpdateUser;

  try{
    const isValidInfo = validationResult(req);

  }catch(err) {
    next(err);
  }
}