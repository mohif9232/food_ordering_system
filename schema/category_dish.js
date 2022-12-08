let {sequelize,DataTypes,Model }=require("../init/dbconnect")

class dishCategory extends Model{}

dishCategory.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    dish_id :{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
        createdBy:{
          type:DataTypes.INTEGER,
          allowNull:false
        }
},{
    modelName:"dishCategory",
    tableName:"category_dish",
    createdAt:false,
    updatedAt:false,
    sequelize
})


module.exports= dishCategory