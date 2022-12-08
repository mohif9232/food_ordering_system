let joi = require("joi");
let { Dish } = require("../schema/dishes");
let { Category, Op } = require("../schema/category");
let dishCategory = require("../schema/category_dish");
const { min } = require("../schema/category_dish");
const { required } = require("joi");

//for add product

function addJoi(param) {
    let schema = joi.object({
        name: joi.string().max(30).min(1).required(),
        quantity: joi.number().required(),
        price: joi.number().required(),
        discount: joi.string().required(),
        stock_alert: joi.string().max(1000).min(0).required(),
        category: joi.array().items(joi.number().min(0)).required()
    }).options({ abortEarly: false })
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

async function dishAdd(param, imagePath, userData) {
    let check = await addJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    console.log(check)
    let finddish = await Dish.findOne({ where: { name: param.name } }).catch((err) => {
        return { error: err }
    })
    if (finddish) {
        return { error: "This dish is already addedd" }
    }

    let checkcat = await Category.findAll({ where: { id: { [Op.in]: param.category } } }).catch((err) => {
        return { error: err }
    })
    if (!checkcat || checkcat.error) {
        return { error: checkcat.error }
    }
    if (checkcat.length != param.category.length) {
        return { error: " Please Provide valid Categoryy" }
    }


    let addDish = await Dish.create({
        name: param.name,
        quantity: param.quantity,
        price: param.price,
        discount: param.discount,
        discounted_price: param.price - param.discount,
        stock_alert: param.stock_alert,
        image_path: imagePath,
        is_available: true,
        is_deleted: false,
        createdBy: userData.id
    }).catch((err) => {
        return { error: err }
    });
    if (!addDish || addDish.error) {
        return { error: "Internal server error" }
    }

    let category = [];
    for (let a of param.category) {
        category.push({ dish_id: addDish.id, category_id: a, createdBy: userData.id })
    }
    let addcategory = await dishCategory.bulkCreate(category).catch((err) => {
        return { error: err }
    })
    if (!addcategory || addcategory.error) {
        return { error: "Internal Server Error" }
    }

    return { data: "Product Added successfullyyy" }
}


//for update product

function updateJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(0).required(),
        name: joi.string().max(30).min(1),
        quantity: joi.number(),
        price: joi.number(),
        discount: joi.number(),
        stock_alert: joi.string().max(1000).min(0)
    }).options({ abortEarly: false })
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

async function dishUpdate(param, imagePath, userData) {
    let check = await updateJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Dish.findOne({ where: { id: param.product_id } }).catch((err) => {
        return { error: err }
    })

    if (!find || find.error) {
        return { error: "This user is not available" }
    }

    let update = await Dish.update({
        name: param.name,
        quantity: param.quantity,
        price: param.price,
        discount: param.discount,
        discounted_price: param.price - param.discount,
        stock_alert: param.stock_alert,
        image_path: imagePath,
        updatedBy: userData.id

    }, {
        where: {
            id: find.id
        }
    }).catch((err) => {
        return { error: err }
    })
    console.log(update)
    if (!update || update.error) {
        return { error: " Internal server Error" }
    }
    return { data: " Updated Successfullyyy " }

}

//view product

function viewJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(0),
        name: joi.string().max(30).min(1),
        quantity: joi.number().min(1)
    }).options({ abortEarly: false })
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

async function dishView(param) {
    let check = await viewJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    };
    let data = {};
    if (param.product_id) {
        data = { where: { id: param.product_id } }
    }
    if (param.name) {
        data = { where: { name: param.name } }
    }

    let get = await Dish.findAll(data).catch((err) => {
        return { error: err }
    });
    console.log(get)
    if (!get || get.error || get.length == 0) {
        return { error: "OOps this dish is not available please search another" }
    }
    return { data: get }
}

//for soft delete product

function Joi(param) {
    let schema = joi.object({
        product_id: joi.number().min(0).required(),
        name: joi.string().max(30).min(1).required()
    }).options({ abortEarly: false })
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

async function dishDelete(param, userData) {
    let check = await Joi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Dish.findOne({
        where: {
            id: param.product_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Id and name not matched please provide proper information" }
    }
    let update = await Dish.update({ is_deleted: true, is_available: false, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { error: " Internal server error" }
    }
    return { data: " Request updated successfullyyy" }
}

//for undo the deleted product


async function dishunDelete(param, userData) {
    let check = await Joi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Dish.findOne({
        where: {
            id: param.product_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Id and name not matched please provide proper information" }
    }
    let update = await Dish.update({ is_deleted: false, is_available: true, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { error: " Internal server error" }
    }
    return { data: " Request updated successfullyyy" }
}

//for block the product


async function dishBlock(param, userData) {
    let check = await Joi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Dish.findOne({
        where: {
            id: param.product_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Id and name not matched please provide proper information" }
    }
    let update = await Dish.update({ is_available: false, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { error: " Internal server error" }
    }
    return { data: " Request updated successfullyyy" }
}

//for unblock the product


async function dishUnblock(param, userData) {
    let check = await Joi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Dish.findOne({
        where: {
            id: param.product_id,
            name: param.name
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Id and name not matched please provide proper information" }
    }
    let update = await Dish.update({ is_available: true, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { error: " Internal server error" }
    }
    return { data: " Request updated successfullyyy" }
}


module.exports = {
    dishAdd,
    dishUpdate,
    dishView,
    dishDelete,
    dishunDelete,
    dishBlock,
    dishUnblock
}