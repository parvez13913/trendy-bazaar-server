import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import multer from "multer";
import config from "../config";
import { ICloudinaryResponse, IUploadFile } from "../interface/file";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | null> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Helper to upload multiple files to Cloudinary
const uploadMultipleToCloudinary = async (
  files: IUploadFile[]
): Promise<ICloudinaryResponse[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  const results = await Promise.all(uploadPromises);

  // Filter out any null results
  return results.filter(
    (result): result is ICloudinaryResponse => result !== null
  );
};

export const FileUploadHelper = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};
