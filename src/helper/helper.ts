import { sign, verify } from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken.model.ts";

const generateAccessToken = (userId: number) => {
  const accessToken = sign({ userId }, Deno.env.get("JWT_SECRET") as string, {
    expiresIn: "15m",
  });
  return accessToken;
};

const generateRefreshToken = async (userId: number) => {
  const refreshToken = sign(
    { userId },
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
