let Cart = require("../schema/cart")
let { Dish, Op } = require("../schema/dishes")
let joi = require("joi")
const { sequelize, QueryTypes } = require("../init/dbconnect")

function cartJoi(param) {
    let schema = joi.object({
        dish_id: joi.number().min(1).required(),
        quantity: joi.number().min(0).max(5).required()
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

async function cartAdd(param, userData) {
    let check = cartJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Cart.findOne({ where: { user_id: userData.id, dish_id: param.dish_id } }).catch((err) => {
        return { error: err }
    })

    if (find) {
        return { error: " This product is already in your cart please choose another" }
    }
    let add = await Cart.create({ user_id: userData.id, dish_id: param.dish_id, quantity: param.quantity }).catch((err) => {
        return { error: err }
    })
    if (!add || add.error) {
        return { error: " Internal Server error" }
    }
    return { data: " product Added to cart successfullyy..." }
}

function updateJoi(param) {
    let schema = joi.object({
        dish_id: joi.number().min(1).required(),
        quantity: joi.number().min(0).max(5).required()
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

async function cartUpdate(param, userData) {
    let check = updateJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Cart.findOne({
        where: {
            dish_id: param.dish_id,
            user_id: userData.id
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: " Internal Server Error" }
    }
    let update = await Cart.update({ quantity: param.quantity }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!update || update.error) {
        return { error: "OOps something went wrong please try again later" }
    }
    return { data: " Ok" }
}

async function cartView(userData) {

    let find = await Cart.findAll({ where: { user_id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "internal  server error" }
    }
    let getProduct = await sequelize.query("SELECT dishes.name, dishes.price,dishes.discount ,dishes.discounted_price, dishes.image_path, cart.quantity FROM dishes LEFT JOIN cart ON dishes.id = cart.dish_id LEFT JOIN user ON user.id = cart.user_id where user.id = :key", {
        replacements: { key: userData.id },
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    console.log(getProduct)
    if (!getProduct || getProduct.error) {
        return { error: "Internal server error" }
    }
    if (getProduct.length == 0) {
        return { data: "Use dont have anything in your cart " }
    }
    return { data: getProduct }
}

function removeCartJoi(param) {
    let schema = joi.object({
        dish_id: joi.number().min(1).required()
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

async function cartRemove(param, userData) {
    let check = removeCartJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Cart.findOne({
        where: {
            [Op.and]: [{
                dish_id: param.dish_id,
                user_id: userData.id
            }]
        }
    }).catch((err) => {
        return { error: err }
    })
    console.log(find)
    if (!find || find.error) {
        return { error: "Your cart dont have this product" }
    }
    let remove = await Cart.destroy({
        where: {
            id: find.id
        }
    }).catch((err) => {
        return { error: err }
    })
    if (!remove || remove.error) {
        return { error: "internal server error" }
    }
    return { data: "Product successfullyy removed from your cart" }
}


module.exports = { cartAdd, cartUpdate, cartView, cartRemove }