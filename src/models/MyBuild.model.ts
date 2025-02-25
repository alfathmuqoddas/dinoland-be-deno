import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db.js";

class MyBuild extends Model<
  InferAttributes<MyBuild>,
  InferCreationAttributes<MyBuild>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare name: string;
  declare description: string;
}

MyBuild.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "MyBuild" }
);

export default MyBuild;
