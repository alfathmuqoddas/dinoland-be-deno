import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface CartAttributes {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare quantity: number;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Cart" }
);

export default Cart;
