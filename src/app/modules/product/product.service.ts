import { prisma } from "../../../shard/prisma";

const createProduct = async (payload: any) => {
  const result = await prisma.product.create({
    data: {
      ...payload,
      productImages: {
        createMany: {
          data: payload.productImage,
        },
      },
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
};
