let { sequelize, DataTypes, Model, Op } = require("../init/dbconnect")

class Order extends Model { };

Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discounted_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    delivery_status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    order_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    confirmedBy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cancelledBy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        defaultValue: 0

    }
}, {
    modelName: "Order",
    tableName: "orders",
    sequelize
});

module.exports = { Order, Op }