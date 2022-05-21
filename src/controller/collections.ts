import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PAGE_DEFAULT, PAGE_SIZE } from "../constants/string";
import Collection from "../models/Collection";
import { SortBaseRequest } from "../types/base";
import { CollectionHandler } from "../types/collections";
import { generateSlug } from "../utils/string";

export const getCollectionController: RequestHandler = async (
  req,
  res,
  next
) => {
  const {
    key,
    page = PAGE_DEFAULT,
    page_size = PAGE_SIZE,
    sort,
  } = req.query as SortBaseRequest;
  try {
    let objectSort = {};
    if (sort && key) {
      objectSort = {
        [key]: sort
      }
    };
    const collections = await Collection.find({}).skip((+page - 1) * page_size).limit(page_size).sort(objectSort);
    const documents = await Collection.find({}).countDocuments();

    res.json({
      message: 'successfully',
      code: 200,
      data: collections,
      total_collections: documents,
      total_page: Math.round(documents / page_size)
    })
  } catch (err) {
    next(err);
  }
};

export const createCollectionController: RequestHandler = async (
  req,
  res,
  next
) => {
  const { image_url, title } = req.body as CollectionHandler;
  try {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      return res.status(422).json({
        message: validate.array()[0].msg,
        code: 422,
        errors: validate.array(),
      });
    }
    const collection = new Collection({
      image_url,
      title,
      seo_id: generateSlug(title),
    });
    const collectionAfterSave = await collection.save();
    res.json({
      code: 200,
      message: "successfully",
      data: collectionAfterSave,
    });
  } catch (err) {
    next(err);
  }
};
