import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { prisma } from "../../../shard/prisma";
import { ILoginUser } from "./auth.interface";

const login = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const isUserExist = await prisma.user.findFirst({ where: { email } });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);

  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid password");
  }

  const { email: userEmail, role } = isUserExist;
  const token = JwtHelpers.createToken(
    { userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = JwtHelpers.createToken(
    { userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    token,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifyToken = null;
  try {
    verifyToken = JwtHelpers.verifiedToken(
      token,
      config.jwt.refresh_secret as Secret
    );
    const { userEmail } = verifyToken;
    const isUserExist = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
    }

    const { email, role } = isUserExist;

    const newAccessToken = JwtHelpers.createToken(
      { email, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid Refresh Token");
  }
};

export const AuthService = {
  login,
  refreshToken,
};
