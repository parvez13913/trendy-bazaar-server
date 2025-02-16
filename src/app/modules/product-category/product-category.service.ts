import { ProductCategory } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import { prisma } from "../../../shard/prisma";

const createProductCategory = async (
  payload: ProductCategory
): Promise<ProductCategory> => {
  const { name } = payload;
  const isExistProductCategory = await prisma.productCategory.findUnique({
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

const getAllProductCategories = async () => {
  const result = await prisma.productCategory.findMany();
  return result;
};

const getSingleProductCategory = async (
  id: number
): Promise<ProductCategory> => {
  const result = await prisma.productCategory.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product category not found");
  }

  return result;
};

const updateProductCategory = async (
  id: number,
  payload: Partial<ProductCategory>
) => {
  const isExistProductCategory = await prisma.productCategory.findUnique({
    where: {
      id,
    },
  });

  if (!isExistProductCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product category not found");
  }

  const result = await prisma.productCategory.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteProductCategory = async (id: number) => {
  const isExistProductCategory = await prisma.productCategory.findUnique({
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
  getAllProductCategories,
  getSingleProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
