import { v2 } from "cloudinary";
import fs from "fs";

export const removeFileWithPath = (
  path: string,
  callback: (err: any) => void
) => {
  return fs.unlink(path, (err) => callback(err));
};
export const uploadMultipleFile = async (path: string) => {
  return new Promise((resolve, reject) => {
    v2.uploader.upload(path, (err, response) => {
      removeFileWithPath(path, (error) => {
        if (error || err) {
          reject("Cannot upload file");
        }
        resolve(response);
      });
    });
  });
};
