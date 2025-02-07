import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface PaymentAttributes {
  id: number;
  userId: number;
  orderId: number;
  paymentMethod: "creditCard" | "cash";
  status: "pending" | "completed" | "failed";
  amount: number;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  declare id: number;
  declare userId: number;
  declare orderId: number;
  declare paymentMethod: "creditCard" | "cash";
  declare status: "pending" | "completed" | "failed";
  declare amount: number;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "Payment" }
);

export default Payment;
