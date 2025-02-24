import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface MyBuildAttributes {
  id: number;
  userId: number;
  name: string;
  description: string;
}

interface MyBuildCreationAttributes extends Optional<MyBuildAttributes, "id"> {}

class MyBuild
  extends Model<MyBuildAttributes, MyBuildCreationAttributes>
  implements MyBuildAttributes
{
  declare id: number;
  declare userId: number;
  declare name: string;
  declare description: string;
}

MyBuild.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
  },
  { sequelize, modelName: "MyBuild" }
);

export default MyBuild;
