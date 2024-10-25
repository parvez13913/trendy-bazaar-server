import { User } from "@prisma/client";
import { prisma } from "../../../shard/prisma";

const createUser = async (data: User): Promise<User | null> => {
  const result = await prisma.user.create({ data });
  return result;
};

export const UsersService = {
  createUser,
};
