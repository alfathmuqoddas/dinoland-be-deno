import express, { Request, Response } from "express";
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
} from "@/routes/index.ts";
// import ensureAuthenticated from "@/middleware/ensureAuthenticated.ts";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "@/models/User.model.ts";
import ensureIsCustomer from "./src/middleware/ensureIsCustomer.ts";
import db from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

db.sync({ force: false }).then(() => {
  app.listen(8080, console.log("Server is running on port: " + 8080));
});
