import { v2 } from "cloudinary"
export const uploadMultipleFile = async (path: string) => {
    return new Promise((resolve, reject) => {
        v2.uploader.upload(path, (err, response) => {
            if (err) {
                reject('Cannot upload file');
            };
            resolve(response);
        })
    })
}