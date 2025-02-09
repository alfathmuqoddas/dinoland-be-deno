import { Sequelize } from "sequelize";

export default new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite-db.db",
});
