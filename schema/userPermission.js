let {sequelize,Model,DataTypes,Op}=require("../init/dbconnect")

class userPermission extends Model{};

userPermission.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permission_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{
    modelName:"userPermission",
    tableName:"user_permission",
    sequelize
})

module.exports = userPermission