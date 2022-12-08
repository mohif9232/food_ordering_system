let {sequelize,DataTypes,Model}= require("../init/dbconnect")

class Cart extends Model{}

Cart.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
        
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    dish_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0,
            max:5
        }
    }
},{
    modelName:"Cart",
    tableName:"cart",
    sequelize
})


module.exports= Cart