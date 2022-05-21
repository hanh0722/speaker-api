import { RequestHandler } from "express";
import request from "../utils/config";
import { isArray } from "../utils/type";

export const onGetCountryController: RequestHandler = async (req, res, next) => {
  try{
    const response = await request.get('https://countriesnow.space/api/v0.1/countries/states');
    const data = response.data?.data;
    if (!isArray(data) || data?.length === 0) {
      return res.status(404).json({
        message: 'Not existed country',
        code: 404
      })
    };
    res.json({
      message: 'Successfully',
      code: 200,
      data: data
    })
  }catch(err) {
    next(err);
  }
}