import Product from "@/models/Products.model.ts";
import User from "@/models/User.model.ts";
import Cart from "@/models/Cart.model.ts";
import RefreshToken from "@/models/RefreshToken.model.ts";
import ProductCategory from "@/models/ProductCategory.model.ts";
import Order from "@/models/Order.model.ts";
import OrderItem from "@/models/OrderItem.model.ts";
import Payment from "@/models/Payment.model.ts";
import ShippingAddress from "@/models/ShippingAddress.model.ts";
import Review from "@/models/Review.model.ts";
import MyBuild from "@/models/MyBuild.model.ts";

Cart.belongsTo(Product, { as: "items", foreignKey: "productId" });

Cart.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Cart, { as: "items", foreignKey: "productId" });

User.hasMany(Cart, { foreignKey: "userId" });

ProductCategory.hasMany(Product, { as: "products", foreignKey: "categoryId" });
Product.belongsTo(ProductCategory, {
  as: "category",
  foreignKey: "categoryId",
});

//user has many orders
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

//user has many reviews
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

//user has many shipping addresses
User.hasMany(ShippingAddress, { foreignKey: "userId", onDelete: "CASCADE" });
ShippingAddress.belongsTo(User, { foreignKey: "userId" });

//order has many order items
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

//order one to one payment
Order.hasOne(Payment, { foreignKey: "paymentId", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

//product has many reviews
Product.hasMany(Review, { foreignKey: "productId", onDelete: "CASCADE" });
Review.belongsTo(Product, { foreignKey: "productId" });

//order item belongs to product
OrderItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

//relation between user and mybuild
User.hasMany(MyBuild, { foreignKey: "userId", onDelete: "CASCADE" });
MyBuild.belongsTo(User, { foreignKey: "userId" });

export {
  Cart,
  Product,
  User,
  RefreshToken,
  ProductCategory,
  Order,
  OrderItem,
  Payment,
  ShippingAddress,
  Review,
  MyBuild,
};
