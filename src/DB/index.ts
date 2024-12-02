import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../config";
import { prisma } from "../shard/prisma";

const superAdminData = {
  email: config.super_admin.email as string,
  password: config.super_admin.password as string,
  role: UserRole.SUPER_ADMIN,
  firstName: "Parvez",
  lastName: "Rahman",
  gender: "Male",
  contactNo: "01977328607",
  address: "Garagonj",
};

export const seedSuperAdmin = async () => {
  const isSuperAdminExist = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });

  if (!isSuperAdminExist) {
    const hashedPassword = await bcrypt.hash(
      superAdminData.password,
      Number(config.bcrypt_salt_round)
    );

    await prisma.user.create({
      data: {
        ...superAdminData,
        password: hashedPassword,
      },
    });
  }
};
