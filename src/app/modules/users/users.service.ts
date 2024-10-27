import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";
import { prisma } from "../../../shard/prisma";

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

export const UsersService = {
  createUser,
};
