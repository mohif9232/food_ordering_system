let { Sequelize, Model, DataTypes, QueryTypes, Op } = require("sequelize");

let sequelize = new Sequelize("mysql://root:@localhost/food_ordering_system");

sequelize.authenticate().then(() => {
    console.log("Connected To Database")
}).catch(() => {
    console.log("Not connected To Database")
})

module.exports = {
    sequelize,
    Model,
    DataTypes,
    QueryTypes,
    Op
}