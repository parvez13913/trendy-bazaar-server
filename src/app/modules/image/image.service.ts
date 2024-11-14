import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import { IUploadFile } from "../../../interface/file";
import { prisma } from "../../../shard/prisma";

const createImage = async (req: Request) => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
  if (!uploadedImage) {
    throw new Error("Image upload failed");
  }

  const result = await prisma.image.create({
    data: {
      fileName: uploadedImage.original_filename || file.originalname,
      url: uploadedImage.url,
    },
  });
  return result;
};

const createManyImage = async (req: Request) => {
  const files = req.files as IUploadFile[];
  if (!files || files.length === 0) throw new Error("No files provided");

  const uploadedImages = await FileUploadHelper.uploadMultipleToCloudinary(
    files
  );

  if (!uploadedImages) {
    throw new Error("Images upload failed");
  }

  const result = await prisma.image.createMany({
    data: uploadedImages.map((uploadedImage) => ({
      fileName: uploadedImage.original_filename,
      url: uploadedImage.url,
    })),
  });

  return result;
};

export const ImageService = {
  createImage,
  createManyImage,
};
