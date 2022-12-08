let{sequelize,DataTypes,Model,Op}=require("../init/dbconnect")

class Permission extends Model{}

Permission.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    permission:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    modelName:"Permission",
    tableName:"permission",
    createdAt:false,
    updatedAt:false,
    sequelize
})

module.exports = {Permission,Op}