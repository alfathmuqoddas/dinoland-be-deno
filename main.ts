// import express, { Request, Response } from "express";
import { Hono } from "hono";
// import session from "express-session";
import UserRoutes from "@/routes/User.route.ts";
import AuthRoutes from "@/routes/Auth.route.ts";
import DashboardRoutes from "@/routes/Dashboard.route.ts";
// import ensureAuthenticated from "@/middleware/ensureAuthenticated.ts";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "@/models/User.model.ts";
import db from "./db.js";

const app = new Hono();

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

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.route("/api/user", UserRoutes);
app.route("/api/auth", AuthRoutes);
app.route("/api/dashboard", DashboardRoutes);

db.sync({ force: false }).then(() => {
  Deno.serve({ port: 3000 }, app.fetch);
});
