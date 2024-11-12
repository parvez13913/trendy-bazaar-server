import { Image } from "@prisma/client";
import { prisma } from "../../../shard/prisma";

const createImage = async (payload: Image): Promise<Image | null> => {
  const result = await prisma.image.create({
    data: {
      ...payload,
    },
  });

  return result;
};

export const ImageService = {
  createImage,
};
