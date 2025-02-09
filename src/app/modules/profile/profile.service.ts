import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { IUploadFile } from "../../../interface/file";
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

const updateProfile = async (token: string, req: Request) => {
  const isValidUser = JwtHelpers.verifiedToken(
    token,
    config.jwt.secret as string
  );

  if (!isValidUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  const { role, userEmail } = isValidUser;

  // Check if user exists
  const isUserExist = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if admin exists (only for admins)
  const isAdminExist = await prisma.admin.findUnique({
    where: { email: userEmail },
  });

  if (!isAdminExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found");
  }

  let result;
  const payload = req.body;
  let profileImageUrl = null;

  if (req.file) {
    const file = req.file as IUploadFile;
    const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);
    profileImageUrl = uploadedImage?.secure_url;
  }

  if (profileImageUrl) {
    payload.profileImage = profileImageUrl;
  }

  // Update database based on user role
  if (role === "ADMIN") {
    result = await prisma.admin.update({
      where: { email: userEmail },
      data: { ...payload },
    });
  } else if (role === "SUPER_ADMIN") {
    result = await prisma.user.update({
      where: { email: userEmail },
      data: { ...payload },
    });
  }

  return result;
};

export const ProfileService = {
  getProfile,
  updateProfile,
};
