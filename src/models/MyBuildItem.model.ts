import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../../db.js";

class MyBuildItem extends Model<
  InferAttributes<MyBuildItem>,
  InferCreationAttributes<MyBuildItem>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare buildId: number;
}

MyBuildItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: true },
    buildId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "MyBuildItem" }
);

export default MyBuildItem;
