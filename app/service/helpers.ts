import JwtWebToken from "jsonwebtoken";
import bcrypt from "bcrypt";

import { SECRET_KEY } from "../config";
import { IUser } from "./interface";

/**
 * Generate User Token Infomation by jsonwebtoken
 * @param user
 * @returns
 */

export const generateToken = (user: IUser) => {
  return JwtWebToken.sign(
    {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
};

export const generatePswHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
