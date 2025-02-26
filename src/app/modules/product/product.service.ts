import { Product } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
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

const getSingleProduct = async (id: number): Promise<Product> => {
  const result = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  return result;
};

const updateProduct = async (
  id: number,
  payload: Partial<Product>
): Promise<Product> => {
  const isProductExist = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  if (!isProductExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

const deleteProduct = async (id: number) => {
  const isProductExist = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  if (!isProductExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  const result = await prisma.product.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
