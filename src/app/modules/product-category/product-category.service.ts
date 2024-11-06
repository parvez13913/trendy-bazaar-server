import { ProductCategory } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import { prisma } from "../../../shard/prisma";

const createProductCategory = async (
  payload: ProductCategory
): Promise<ProductCategory> => {
  const { name } = payload;
  const isExistProductCategory = await prisma.productCategory.findFirst({
    where: {
      name,
    },
  });

  if (isExistProductCategory) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Already exist the product category"
    );
  }

  const result = await prisma.productCategory.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getSingleProductCategory = async (
  id: number
): Promise<ProductCategory> => {
  const result = await prisma.productCategory.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product category not found");
  }

  return result;
};

const deleteProductCategory = async (id: number) => {
  const isExistProductCategory = await prisma.productCategory.findFirst({
    where: {
      id,
    },
  });

  if (!isExistProductCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product category not found");
  }

  const result = await prisma.productCategory.delete({
    where: {
      id,
    },
  });
};

export const ProductCategoryService = {
  createProductCategory,
  getSingleProductCategory,
  deleteProductCategory,
};
