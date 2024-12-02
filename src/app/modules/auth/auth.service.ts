import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { prisma } from "../../../shard/prisma";
import { ILoginUser } from "./auth.interface";
import { sendEMail } from "./send-reset-mail";

const register = async (
  data: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  const isUserExist = await prisma.user.findUnique({
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

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: isUserExist.id,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const logout = async (token: string): Promise<void> => {
  // Validate if token is provided
  if (!token) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token is required");
  }

  // Delete the refresh token from the database
  const result = await prisma.refreshToken.deleteMany({
    where: { token },
  });

  // If no tokens were deleted, the token is invalid
  if (result.count === 0) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Token not found or already invalidated"
    );
  }

  return;
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

const forgotPassword = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  const passwordResetToken = JwtHelpers.createPasswordResetToken(
    { email: isUserExist?.email },
    config.jwt.secret as string,
    "5m"
  );

  const resetLink: string =
    config.reset_password_link + `token=${passwordResetToken}`;

  await sendEMail(
    isUserExist?.email,
    `
      <div>
         <p>Hi, ${isUserExist?.firstName}</p>
         <p>your password reset link: <a href=${resetLink}>Click Here</a></p>
         <p>Thank you</p>
      </div>`
  );
};

export const AuthService = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
};
