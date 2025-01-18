import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { prisma } from "../../../shard/prisma";

const getProfile = async (token: string) => {
  const isValidUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as string
  );

  if (!isValidUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorize");
  }

  const { role, userEmail } = isValidUser;
  let result;
  if (role === "ADMIN") {
    result = await prisma.admin.findUnique({
      where: {
        email: userEmail,
      },
    });
  } else {
    result = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
  }

  return result;
};

export const ProfileService = {
  getProfile,
};
