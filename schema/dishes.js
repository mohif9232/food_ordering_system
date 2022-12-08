let {sequelize,DataTypes,Model,Op}= require("../init/dbconnect")

class Dish extends Model{}


Dish.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discounted_price:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    image_path:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stock_alert:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    is_available:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
    
},{
    modelName:"Dish",
    tableName:"dishes",
    sequelize
})


module.exports= { Dish , Op}