import { RequestHandler } from "express";
import { FileArray } from "../types/file";
import { uploadMultipleFile } from "../utils/files";

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    const files = req.files! as FileArray;

    const uploadFilePromise = files.map(item => {
        return uploadMultipleFile(item.path);
    });

    const response = await Promise.all(uploadFilePromise);

    const getURLs = response.map((item: any) => {
        return item.secure_url;
    })

    res.json({
        message: 'successfully',
        code: 200,
        urls: getURLs
    })
  } catch (err) {
      console.log(err);
  }
};
