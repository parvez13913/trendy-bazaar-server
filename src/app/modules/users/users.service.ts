import { Prisma, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import { paginationHelpers } from "../../../helpers/pagination-helpers";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { prisma } from "../../../shard/prisma";
import { userFilterableFields } from "./user.constant";
import { IUserFilters } from "./user.interface";

const getAllUsers = async (
  filters: IUserFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { limit, skip, page } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userFilterableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: { email },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return result;
};

const updateUser = async (
  email: string,
  payload: Partial<User>
): Promise<User | null> => {
  const isUserExist = await prisma.user.findFirst({ where: { email } });
  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.update({
    where: { email },
    data: payload,
  });

  return result;
};

const deleteUser = async (email: string): Promise<User | null> => {
  const isUserExist = await prisma.user.findFirst({ where: { email } });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const result = await prisma.user.delete({ where: { email } });

  return result;
};

export const UsersService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
