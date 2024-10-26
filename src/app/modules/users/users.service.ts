import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../../../config";
import { prisma } from "../../../shard/prisma";

const createUser = async (data: User): Promise<User | null> => {
  const hashedPassword = await bcrypt.hash(
    data?.password,
    Number(config.bcrypt_salt_round)
  );
  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return result;
};

export const UsersService = {
  createUser,
};
