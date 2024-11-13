import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import { IUploadFile } from "../../../interface/file";

const createImage = async (req: Request) => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  return uploadedImage?.url;
};

export const ImageService = {
  createImage,
};
