import express, { Request, Response, NextFunction } from "express";
import process from "node:process";
// import session from "express-session";
import {
  UserRoutes,
  AuthRoutes,
  CartRoutes,
  DashboardRoutes,
  ProductRoutes,
  ProductCategoryRoutes,
  ShippingAddressRoutes,
  OrderRoutes,
  MyBuildRoutes,
  MyBuildItemRoutes,
} from "@/routes/index.ts";
// import ensureAuthenticated from "@/middleware/ensureAuthenticated.ts";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "@/models/User.model.ts";
import morganMiddleware from "@/middleware/morgan.ts";
import db from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morganMiddleware);

Deno.env.set("JWT_SECRET", "your_jwt_secret_key");
Deno.env.set("REFRESH_SECRET", "your_refresh_token_secret");

type JwtPayload = {
  userId: number;
};

type DoneFunction = (error: any, user?: any, info?: any) => void;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Deno.env.get("JWT_SECRET") as string,
    },
    async (jwtPayload: JwtPayload, done: DoneFunction) => {
      try {
        const user = await User.findByPk(jwtPayload.userId);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "User not found or unauthorized",
          });
        }
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    }
  )
);

app.use(passport.initialize());

app.get("/", (_req: Request, res: Response) => {
  res.json("Hello World");
});

app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use(
  "/api/dashboard",
  passport.authenticate("jwt", { session: false }),
  DashboardRoutes
);
app.use(
  "/api/cart",
  passport.authenticate("jwt", { session: false }),
  // ensureIsCustomer,
  CartRoutes
);

app.use("/api/product", ProductRoutes);
app.use("/api/productCategory", ProductCategoryRoutes);

app.use(
  "/api/shippingAddress",
  passport.authenticate("jwt", { session: false }),
  ShippingAddressRoutes
);

app.use(
  "/api/order",
  passport.authenticate("jwt", { session: false }),
  OrderRoutes
);

app.use(
  "/api/my-build",
  passport.authenticate("jwt", { session: false }),
  MyBuildRoutes
);

app.use(
  "/api/my-build-item",
  passport.authenticate("jwt", { session: false }),
  MyBuildItemRoutes
);

// ✅ Error Handling Middleware (Catch Unhandled Errors)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Deno.env.get("PORT") || 8080;
(async () => {
  try {
    await db.sync({ force: false });
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Exit if DB fails to connect
  }
})();
