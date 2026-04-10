import RefreshToken from "@/models/RefreshToken.model.ts";
import { productSeedData } from "./productSeedData.ts";
import { categorySeedData } from "./categorySeedData.ts";
import { jwtVerify, SignJWT, JWTPayload } from "jose";

const generateAccessToken = async (userId: number, userRole: string) => {
  const secret = new TextEncoder().encode(Deno.env.get("JWT_SECRET"));
  if (!secret.length) throw new Error("JWT_SECRET is not set");
  return new SignJWT({ userId, userRole } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
};

const generateRefreshToken = async (userId: number, userRole: string) => {
  const refreshSecret = new TextEncoder().encode(
    Deno.env.get("REFRESH_SECRET"),
  );
  if (!refreshSecret.length) throw new Error("REFRESH_SECRET is not set");
  const refreshToken = await new SignJWT({ userId, userRole } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(refreshSecret);

  await RefreshToken.create({ token: refreshToken, userId: userId });
  return refreshToken;
};

const decryptToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("JWT is valid:", payload);
    return payload;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};

const decryptRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    console.log("Refresh token is valid:", payload);
    return payload;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  decryptToken,
  decryptRefreshToken,
  categorySeedData,
  productSeedData,
};
