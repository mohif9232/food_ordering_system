const joi = require("joi");
const { where } = require("sequelize");
let {Category} = require("../schema/category")

//Add category
async function checkcat(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(0).required(),
        description: joi.string().max(30).min(3).required(),
        pid: joi.number().min(0).required(),
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

async function categoryAdd(param, userData) {
    let check = await checkcat(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }

    let find = await Category.findOne({ where: { name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (find) {
        return { error: " This Category is already addedd... " }
    }

    let addcat = await Category.create({
        name: param.name,
        description: param.description,
        pid: param.pid,
        is_available: true,
        is_deleted: false,
        createdBy: userData.id
    }).catch((err) => {
        return { error: err }
    });
    if (!addcat || addcat.error) {
        return { error: " Something went wrong pls try again later" }
    }

    return { data: " category added successfullyyy" }
}

//for view category

async function checkCategoryView(param) {
    let schema = joi.object({
        id: joi.number().max(100).min(1),
        name: joi.string().max(30).min(1)
    }).options({ abortEarly: false });

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

async function viewCategory(param) {
    let check = await checkCategoryView(param).catch((err) => {
        return { error: err }
    });

    if (!check || check.error) {
        return { error: check.error }
    }

    let query = {};
    if (param.id) {
        query = { where: { id: param.id } }
    }
    if (param.name) {
        query = { where: { name: param.name } }
       
    }
    let find = await Category.findAll(query).catch((err) => {
        return { error: err }
    })
  
    if( !find || find.error || find.length == 0) {
        return { error: "This category Not available" }
    }
    return { data: find }
}


//update category
async function checkupdatecat(param) {
    let schema = joi.object({
        category_id: joi.number().min(1).required(),
        name: joi.string().max(30).min(0),
        description: joi.string().max(250).min(1),
        pid: joi.number().min(0)

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


async function categoryUpdate(param, userData) {
    let check = await checkupdatecat(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Category.findOne({ where: { id: param.category_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Id and name not matched " }
    }
    let update = await Category.update({
        name: param.name,
        description: param.description,
        pid: param.pid,
        updatedBy: userData.id
    },{where:{id:find.id}}).catch((err)=>{
        return { error: err}
    })

    if ( ! update || update.error){
        return { error :" oops somthing went wrongg!!!!!"}
    }
    return { data:" Updated Successfullyyy..."}
}

//for soft delete the category

async function checkDelete(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
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


async function softDeletecat(param,userData) {
    let check = await checkDelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_deleted: true ,is_available:false ,updatedBy:userData.id}, {
        where: {
            id: finduser.id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for undo the soft delete category

async function checkUndelete(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
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


async function softUndeletecat(param,userData) {
    let check = await checkUndelete(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_deleted: false ,is_available:true ,updatedBy:userData.id}, {
        where: {
            id: finduser.id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for block the category

async function checkUnactive(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
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


async function unActivecat(param,userData) {
    let check = await checkUnactive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_available: false , updatedBy:userData.id}, {
        where: {
            id: finduser.id
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}


//for unblock the category

async function checkActive(param) {
    let schema = joi.object({
        category_id: joi.number().max(100).min(0).required(),
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


async function activeCat(param,userData) {
    let check = await checkActive(param).catch((err) => {
        return { error: err }
    })
    if (!check || check.error) {
        return { error: check.error }
    };

    let finduser = await Category.findOne({
        where: {
            id: param.category_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    });
    if (!finduser || (finduser && finduser.error)) {
        return { error: "Id and Name not matched" }
    }
    let update = await Category.update({ is_available: true, updatedBy:userData.id }, {
        where: {
            id: finduser.id,
        }
    }).catch((err) => {
        return { error: err }
    });

    if (!update || update.error) {
        return { error: " Internal Server Error" }
    }

    return { data: "Your request succeessfully updated" }
}



module.exports={categoryAdd,viewCategory,categoryUpdate,softDeletecat,softUndeletecat,activeCat,unActivecat}