import express, { Request, Response } from "express";
import session from "express-session";
import UserRoutes from "@/routes/User.route.ts";
import AuthRoutes from "@/routes/Auth.route.ts";
import ensureAuthenticated from "@/middleware/ensureAuthenticated.ts";

import db from "./db.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "11091998",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json("Hello World");
});

app.get("/protected", ensureAuthenticated, (req: Request, res: Response) => {
  res.json("Protected route");
});

app.use("/api/user", UserRoutes);
app.use("/api/auth", AuthRoutes);

db.sync({ force: false }).then(() => {
  app.listen(3000, console.log("Server is running on port: " + 3000));
});
