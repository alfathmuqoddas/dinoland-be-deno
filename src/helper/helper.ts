import { sign, verify } from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken.model.ts";

const generateAccessToken = (userId: number, userRole: string) => {
  const accessToken = sign(
    { userId, userRole },
    Deno.env.get("JWT_SECRET") as string,
    {
      expiresIn: "15m",
    }
  );
  return accessToken;
};

const generateRefreshToken = async (userId: number, userRole: string) => {
  const refreshToken = sign(
    { userId, userRole },
    Deno.env.get("REFRESH_SECRET") as string,
    { expiresIn: "7d" }
  );
  await RefreshToken.create({ token: refreshToken, userId: userId });
  return refreshToken;
};

const decryptToken = (token: string) => {
  return verify(token, Deno.env.get("JWT_SECRET") as string);
};

export { generateAccessToken, generateRefreshToken, decryptToken };
