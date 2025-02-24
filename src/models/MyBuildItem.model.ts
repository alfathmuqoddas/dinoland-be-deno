import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface MyBuildItemAttributes {
  id: number;
  productId: number;
  buildId: number;
}

interface MyBuildItemCreationAttributes
  extends Optional<MyBuildItemAttributes, "id"> {}

class MyBuildItem
  extends Model<MyBuildItemAttributes, MyBuildItemCreationAttributes>
  implements MyBuildItemAttributes
{
  declare id: number;
  declare productId: number;
  declare buildId: number;
}

MyBuildItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buildId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "MyBuildItem" }
);

export default MyBuildItem;
