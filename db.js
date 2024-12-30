import { Sequelize } from "npm:sequelize";

export default new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite-db.db",
});
