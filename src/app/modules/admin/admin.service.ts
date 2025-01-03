import { Admin, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/pagination-helpers";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { prisma } from "../../../shard/prisma";
import { adminFilterableFields } from "./admin.constants";
import { IAdminFilters } from "./admin.interface";

const getAllAdmins = async (
  filters: IAdminFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
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

export const AdminService = {
  getAllAdmins,
};
