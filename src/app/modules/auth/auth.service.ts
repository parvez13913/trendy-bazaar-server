import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { prisma } from "../../../shard/prisma";
import { ILoginUser } from "./auth.interface";

const register = async (
  data: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      email: data?.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "There is already a user by this email."
    );
  }

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

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to register.");
  }

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

  const { email: userEmail, role } = user;

  const accessToken = JwtHelpers.createToken(
    { userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = JwtHelpers.createToken(
    { userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

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
  const accessToken = JwtHelpers.createToken(
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
    accessToken,
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
  register,
  login,
  refreshToken,
};
