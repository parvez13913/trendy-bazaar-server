import { SubProductCategory } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import { prisma } from "../../../shard/prisma";

const createSubProductCategory = async (
  payload: SubProductCategory
): Promise<SubProductCategory> => {
  const { name } = payload;
  const isExistSubProductCategory = await prisma.subProductCategory.findUnique({
    where: {
      name,
    },
  });

  if (isExistSubProductCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Sub product category not found");
  }

  const result = await prisma.subProductCategory.create({
    data: payload,
  });

  return result;
};

const getSingleSubProductCategory = async (
  id: number
): Promise<SubProductCategory | null> => {
  const result = await prisma.subProductCategory.findUnique({
    where: {
      id,
    },
  });

  return result;
};

export const SubProductCategoryService = {
  createSubProductCategory,
  getSingleSubProductCategory,
};
