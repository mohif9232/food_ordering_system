let { User } = require("../schema/user");
let { Permission } = require("../schema/permission")
let { sequelize, QueryTypes, Op } = require("../init/dbconnect")
let joi = require("joi");
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken");
let randomstring = require("randomstring")
let { email } = require("../helper/email");
const userPermission = require("../schema/userPermission");
let { secretKey } = require("../config/constant")



//for registration


function checkregister(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(2).required(),
        username: joi.string().max(100).min(2).required(),
        password: joi.string().max(30).min(3).required(),
        mobile_no: joi.string().max(10).min(10).required()
    }).options({
        abortEarly: false
    })

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function registerUser(param) {
    let check = checkregister(param)
    if (!check || check.error) {
        return { error: check.error }
    }

    let finduser = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    });

    if (finduser) {
        return { error: "This user is already existed" }
    }
    param.password = await bcrypt.hash(param.password, 10).catch((err) => {
        return { error: err }
    })
    if (!param.password || param.password.error) {
        return { error: "internal Server Error" }
    };

    let registeruser = await User.create({
        name: param.name,
        username: param.username,
        password: param.password,
        mobile_no: param.mobile_no
    }).catch((err) => {
        return { error: err }
    })
    if (!registeruser || registeruser.error) {
        return { error: "Internal Server Error" }
    };
    let givePermission = await userPermission.create({ user_id: registeruser.id, permission_id: 1 }).catch((err) => {
        return { error: err }
    });
    if (!givePermission || givePermission.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "you are registered Successfullyy" }
}



//for login


async function checkLogin(param) {
    let schema = joi.object({
        username: joi.string().max(100).min(2).required(),
        password: joi.string().max(100).min(1).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function loginUser(param) {
    let check = await checkLogin(param)
    if (check.error || !check) {
        return { error: check.error }
    }
    let findOne = await User.findOne({ where: { username: param.username }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (!findOne || findOne.error) {
        return { error: "Username & password incorrect" }
    }
    if (findOne.is_deleted == 1) {
        return { error: "your account suspended by admin" }
    }
    if (findOne.is_active == 0) {
        return { error: "your account deactivate by admin" }
    }
    let checkpass = await bcrypt.compare(param.password, findOne.password).catch((err) => {
        return { error: err }
    })
    if (!checkpass || checkpass.error) {
        return { error: "username and password incorrect " }
    }

    let token = jwt.sign({ id: findOne.id }, secretKey, { expiresIn: "1d" })
    if (!token || token.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Login successfully", token }
}

//for forget password

async function checkForget(param) {
    let schema = joi.object({
        username: joi.string().max(100).min(2).required(),
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}


async function forgetUser(param) {
    let check = await checkForget(param)
    if (check.error || !check) {
        return { error: check.error }
    }
    let findUser = await User.findOne({ where: { username: param.username } }).catch((err) => {
        return { error: err }
    })
    if (!findUser || (findUser && findUser.error)) {
        return { error: "user name not found" }
    }
    let token = randomstring.generate(10)
    let add = await User.update({ token: token }, { where: { id: findUser.id } }).catch((err) => {
        return { error: err }
    })
    if (!add || add.error) {
        return { error: " Internal Server Error" }
    }
    let mailoption = {
        from: "mohif.waghu@somaiya.edu",
        to: findUser.username,
        subject: "forget password token",
        text: "for reset your password please use this token:" + token
    };

    let sendmail = await email(mailoption).catch((err) => {
        return { error: err }
    })
    if (!sendmail || sendmail.error) {
        return { error: sendmail.error }
    }
    return { data: sendmail }
}

//for reset password
async function checkReset(param) {
    let schema = joi.object({
        token: joi.string().max(100).min(2).required(),
        newpassword: joi.string().max(100).min(3).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function resetPassword(param) {
    let check = await checkReset(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let checktoken = await User.findOne({ where: { token: param.token } }).catch((err) => {
        return { error: err }
    })
    if (!checktoken || checktoken.error) {
        return { error: "Your Token is not valid" }
    }
    let resetpass = await User.update({ password: await bcrypt.hash(param.newpassword, 10) }, { where: { id: checktoken.id } }).catch((err) => {
        return { error: err }
    })
    console.log(resetpass)
    if (!resetpass || resetpass.error) {
        return { error: "Internal Server Error" }
    }
    let emptyToken = await User.update({ token: "" }, { where: { id: checktoken.id } }).catch((err) => {
        return { error: err }
    })
    console.log(emptyToken)
    if (!emptyToken || emptyToken.error) {
        return { error: "internal server error" }
    }
    return { data: "password reset successfully you can login again" }
}


//for password change

async function checkPass(param) {
    let schema = joi.object({
        oldpassword: joi.string().max(100).min(2).required(),
        newpassword: joi.string().max(100).min(3).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function changePass(param, userData) {
    let check = await checkPass(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let checkpass = await User.findOne({ where: { id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!checkpass || checkpass.error) {
        return { error: "something went wrong" }
    }
    let comparepass = await bcrypt.compare(param.oldpassword, checkpass.password).catch((err) => {
        return { error: err }
    });
    if (!comparepass || comparepass.error) {
        return { error: "Your password is not correct" }
    }
    let updatepassword = await User.update({ password: await bcrypt.hash(param.newpassword, 10) }, {
        where: {
            id: checkpass.id
        }
    }).catch((err) => {
        return { error: err }
    });
    console.log(updatepassword)
    if (!updatepassword || updatepassword.error) {
        return { error: "internal server error" }
    }
    return { data: "password changed successfullyyy...." }
}

//about me

async function getMe(userData) {
    let get = await User.findOne({ attributes: ["name", "username", "mobile_no", "profile_pic_path"], where: { id: userData.id } }).catch((err) => {
        return { error: err }
    });
    console.log(get)
    if (!get || get.error) {
        return { error: "internal server error" }
    }
    return { data: get }
}


//update profile

async function checkUpdate(param) {
    let schema = joi.object({
        name: joi.string().max(100).min(2),
        username: joi.string().max(100).min(3),
        mobile_no: joi.string().max(10).min(3)
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function updateMe(param, userData) {
    let check = await checkUpdate(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await User.findOne({ where: { id: userData.id } }).catch((err) => {
        return { error: err }
    });
    if (!find || find.error) {
        return { error: "internal server error" }
    }
    let updateuser = await User.update(param, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!updateuser || updateuser.error) {
        return { error: "something went wrong" }
    }
    return { data: "hurrayyyy updated successfullyyy" }
}

async function addprofile(imagePath, loginUser) {
    let finduser = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
        return { error: err }
    });
    if (!finduser || finduser.error) {
        return { error: "Something Went Wrong" }
    }
    let addImage = await User.update({ profile_pic_path: imagePath }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!addImage || addImage.error) {
        return { error: "something went wrong" }
    }
    return { data: "profile pic uploaded successfullyy" }
}

//for updating profile pic

async function updateProfile(imagePath, loginUser) {
    let find = await User.findOne({ where: { id: loginUser.id } }).catch((err) => {
        return { error: err }
    });
    console.log(find)
    if (!find || find.error) {
        return { error: "Something is not correct" }
    };
    let updatepic = await User.update({ profile_pic_path: imagePath }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    });
    if (!updatepic || updatepic.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "Your Profile pic updated successfully...." }
}

async function deactivate(param, userData) {
    let finduser = await User.findOne({ where: { id: userData.id } }).catch((err) => {   //id ke jagah token baadme
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Invalid Token" }
    }
    let update = await User.update({ is_deleted: 1 }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    console.log(update)
    if (!update || update.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "You are deactivate successfully for activation again please login again" }

}

////get all user
async function checkbody(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
    }).options({
        abortEarly: false
    });
    console.log(param)
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}
async function findAll(param) {
    let check = await checkbody(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let query = {};
    if (param.user_id) {
        query = { where: { id: param.user_id } }
    }
    if (param.name) {
        query = { where: { name: param.name } }
    }
    if (param.username) {
        query = { where: { username: param.username } }
    }

    let alluser = await User.findAll(query).catch((err) => {
        return { error: err }
    })
    console.log(alluser)
    if (!alluser || (alluser && alluser.error) || alluser.length == 0) {
        return { error: "Cant find user" }
    }
    return { data: alluser }
};


//assign permission

async function checkassign(param) {
    let schema = joi.object({
        user_id: joi.number().required(),
        permissionId: joi.array().items(joi.number().min(0)).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function assignPer(param, userData) {
    let check = await checkassign(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let finduser = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!finduser || finduser.error) {
        return { error: "USer not found" }
    }

    let checkper = await Permission.findAll({ where: { id: { [Op.in]: param.permissionId } } }).catch((err) => {
        return { error: err }
    });
    if (!checkper || checkper.error) {
        return { error: checkper.error }
    }
    if (checkper.length != param.permissionId.length) {
        return { error: "Invalid Permissionss" }
    }

    let permission = [];
    for (let data of param.permissionId) {
        permission.push({ user_id: finduser.id, permission_id: data, createdBy: userData.id })
    }

    let addpermission = await userPermission.bulkCreate(permission).catch((err) => {
        return { error: err }
    });
    if (!addpermission || addpermission.error) {
        return { error: "internal server errorr" }
    }
    return { data: "Permissions added successfullyyy" }

}

//get the permission of the user

async function checkuserper(param) {
    let schema = joi.object({
        user_id: joi.number().required(),
        name: joi.string().min(2)
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function getpermission(param) {
    let check = await checkuserper(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "User not found" }
    }
    let getpermissions = await sequelize.query("SELECT user.id , user.name , GROUP_CONCAT(permission.permission) AS permission FROM user LEFT JOIN user_permission ON user.id = user_permission.user_id LEFT JOIN permission ON permission.id=user_permission.permission_id WHERE user.id = :key GROUP BY user.id", {
        replacements: { key: find.id },
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    console.log(getpermissions)

    if (!getpermissions || getpermissions.error) {
        return { error: "Internal Server Error" }
    }
    return { data: getpermissions }
}

//get all the permission

async function getallpermission() {
    let getpermission = await User.sequelize.query("SELECT * FROM permission", {
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    console.log(getpermission)
    if (!getpermission || getpermission.error) {
        return { error: "Internal server error" }
    }
    return { data: getpermission }
}

//for update user

async function checkupdate(param) {
    let schema = joi.object({
        user_id: joi.number().max(300).min(0).required(),
        name: joi.string().max(30).min(1),
        username: joi.string().max(30).min(3),
        mobile_no: joi.string().max(10).min(4)
    }).options({
        abortEarly: false
    });

    let check = schema.validate(param)
    if (check.error) {
        let error = [];
        for (let err of check.error.details) {
            error.push(err.message)
        };
        return { error: error }
    }
    return { data: check.value }
}

async function update(param, userData) {
    let check = await checkupdate(param).catch((err) => {
        return { error: err }
    });
    if (!check || check.error) {
        return { error: check.error }
    }
    let finduser = await User.findOne({ where: { id: param.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!finduser || finduser.error) {
        return { error: "Id not found" }
    }
    let updateuser = await User.update({
        name: param.name,
        username: param.username,
        mobile_no: param.mobile_no,
        updatedBy: userData.id
    }, { where: { id: finduser.id } }).catch((err) => {
        return { error: err }
    });
    if (!updateuser || updateuser.error) {
        return { error: " Internal Server Error" }
    }
    return { data: " User Updated Successfully" }
}

//for soft delete the user


async function checkDelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}




async function softDelete(param, userData) {
    let check = await checkDelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: true, is_active: false, updatedBy: userData.id }, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully deleted the user" }
}


//for undo the soft delete

async function checkUndelete(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required(),
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function softUndelete(param, userData) {
    let check = await checkUndelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_deleted: false, is_active: true, updatedBy: userData.id }, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully undeleted user" }
}


//for block the user

async function checkUnactive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function unActive(param, userData) {
    let check = await checkUnactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: false, updatedBy: userData.id }, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "sucessfully block the user" }
}

//for unblock the block user

async function checkActive(param) {
    let schema = joi.object({
        user_id: joi.number().max(100).min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param);
    if (!check || check.error) {
        let error = [];
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error };
    }
    return { data: check.value }
}


async function active(param, userData) {
    let check = await checkActive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await User.findOne({
        where: {
            id: param.user_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await User.update({ is_active: true, updatedBy: userData.id }, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Successfully unblock the user" }
}

module.exports = {
    registerUser,
    loginUser,
    forgetUser,
    resetPassword,
    changePass,
    getMe,
    updateMe,
    addprofile,
    updateProfile,
    deactivate,
    findAll,
    assignPer,
    getpermission,
    getallpermission,
    update,
    softDelete,
    softUndelete,
    active,
    unActive
}