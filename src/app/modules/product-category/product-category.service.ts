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

export const ProductCategoryService = {
  createProductCategory,
};
