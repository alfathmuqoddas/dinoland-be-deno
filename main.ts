import express, { Request, Response } from "express";
// import session from "express-session";
import {
  UserRoutes,
  AuthRoutes,
  CartRoutes,
  DashboardRoutes,
  ProductRoutes,
} from "@/routes/index.ts";
// import ensureAuthenticated from "@/middleware/ensureAuthenticated.ts";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "@/models/User.model.ts";
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
          return done(null, false);
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
  CartRoutes
);

app.use("/api/product", ProductRoutes);

db.sync({ force: true }).then(() => {
  app.listen(3000, console.log("Server is running on port: " + 3000));
});
