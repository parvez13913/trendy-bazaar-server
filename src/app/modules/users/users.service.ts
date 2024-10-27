import { Prisma, User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { prisma } from "../../../shard/prisma";
import { userFilterableFields } from "./user.constant";
import { IUserFilters } from "./user.interface";

const createUser = async (data: User): Promise<User | null> => {
  const hashedPassword = await bcrypt.hash(
    data?.password,
    Number(config.bcrypt_salt_round)
  );
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  if (data.role === UserRole.CUSTOMER) {
    await prisma.customer.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        profileImage: data.profileImage,
        userId: user.id,
        gender: data.gender,
        contactNo: data.contactNo,
        address: data.address,
        role: data.role,
        bloodGroup: data.bloodGroup,
        dateBirth: data.dateBirth,
      },
    });
  } else if (data.role === UserRole.ADMIN) {
    await prisma.admin.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        profileImage: data.profileImage,
        userId: user.id,
        gender: data.gender,
        contactNo: data.contactNo,
        address: data.address,
        role: data.role,
        bloodGroup: data.bloodGroup,
        dateBirth: data.dateBirth,
      },
    });
  }

  return user;
};

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

export const UsersService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
