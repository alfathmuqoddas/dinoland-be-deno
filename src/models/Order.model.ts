import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface OrderAttributes {
  id: number;
  userId: number;
  status: "pending" | "delivered" | "cancelled";
  totalPrice: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  declare id: number;
  declare userId: number;
  declare status: "pending" | "delivered" | "cancelled";
  declare totalPrice: number;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Order" }
);

export default Order;
