import { Admin, Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import { paginationHelpers } from "../../../helpers/pagination-helpers";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { prisma } from "../../../shard/prisma";
import { adminFilterableFields } from "./admin.constants";
import { IAdminFilters } from "./admin.interface";

const getAllAdmins = async (
  filters: IAdminFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<Omit<Admin, "password">[]>> => {
  const { limit, skip, page } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminFilterableFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      gender: true,
      bloodGroup: true,
      dateOfBirth: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      userId: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.admin.count({
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

const getSingleAdmin = async (email: string) => {
  const result = await prisma.admin.findUnique({
    where: { email },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return result;
};

const updateAdmin = async (
  email: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  const isAdminExist = await prisma.admin.findUnique({ where: { email } });
  if (!isAdminExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found");
  }

  const result = await prisma.admin.update({
    where: { email },
    data: payload,
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
};
