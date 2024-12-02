import jwt, { JwtPayload, Secret } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  exp: number;
}

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, { expiresIn: expireTime });
};

const verifiedToken = (token: string, secret: Secret): JwtPayload => {
  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (typeof decoded === "string" || !decoded.exp) {
    throw new Error("Invalid token");
  }

  return decoded as CustomJwtPayload;
};

const createPasswordResetToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expireTime,
  });
};

export const JwtHelpers = {
  createToken,
  verifiedToken,
  createPasswordResetToken,
};
