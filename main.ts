import express, { Request, Response } from "express";
import UserRoutes from "@/routes/User.route.ts";
import db from "./db.js";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json("Hello World");
});

app.use("/api/user", UserRoutes);

db.sync({ force: false }).then(() => {
  app.listen(3000, console.log("Server is running on port: " + 3000));
});
