import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db.js";

interface ShippingAddressAttributes {
  id: number;
  addressName: string;
  userId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressCreationAttributes
  extends Optional<ShippingAddressAttributes, "id"> {}

class ShippingAddress
  extends Model<ShippingAddressAttributes, ShippingAddressCreationAttributes>
  implements ShippingAddressAttributes
{
  declare id: number;
  declare addressName: string;
  declare userId: number;
  declare addressLine1: string;
  declare addressLine2: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare country: string;
}

ShippingAddress.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    addressName: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    addressLine1: { type: DataTypes.STRING, allowNull: false },
    addressLine2: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    zipCode: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "ShippingAdress" }
);

export default ShippingAddress;
