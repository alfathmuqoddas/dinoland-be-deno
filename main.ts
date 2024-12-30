import express from "express";
import User from "./models/User.model.js";
import db from "./db.js";
const app = express();

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.get("/seed", async (req, res) => {
  try {
    const user = {
      name: "John",
      email: "john@gmail.com",
      password: "password",
    };
    await User.create(user);

    res.status(201).json({ message: "Seed data inserted successfully" });
  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).json({ error: "Failed to seed data" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await User.findAll()

    res.status(201).json(users);
  } catch (err) {
    console.log("Error fetching data:", err);
    res.status(500).json({error: "Error fetching data"})
  }
})

db.sync({ force: false })
  .then(() => {
    app.listen(3000, console.log("Server is running on port: " + 3000));
  });
