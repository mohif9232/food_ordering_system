let { Order } = require("../schema/order")
let joi = require("joi")
let { Dish, Op } = require("../schema/dishes")
const { sequelize, QueryTypes } = require("../init/dbconnect")
let { email } = require("../helper/email")
const { User } = require("../schema/user")




function orderJoi(param) {
    let schema = joi.object({
        product_id: joi.number().min(1).required(),
        quantity: joi.number().min(1).max(5).required()
    }).options({ abortEarly: false })

    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let a of check.error.details) {
            error.push(a.message)
        }
        return { error: error }
    }
    return { data: check.value }
}

async function orderPlace(param, productData, userData) {
    let check = orderJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let order = await Order.create({
        user_id: userData.id,
        product_id: productData.id,
        quantity: param.quantity,
        price: productData.price,
        discount: productData.discount,
        discounted_price: productData.discounted_price,
        total_price: (productData.discounted_price * param.quantity),
        order_status: 1,
    }).catch((err) => {
        return { error: err }
    })
    console.log(order)
    if (!order || order.error) {
        return { error: "Internal Server Error" }
    }
    return { data: "your order placed Successfullyyy..." }
}

async function viewOrder(userData) {

    let search = await sequelize.query("SELECT orders.id AS order_id ,dishes.name,dishes.image_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price, orders.order_status, orders.payment_status , orders.delivery_status FROM orders LEFT JOIN dishes ON dishes.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id where user.id=:key", {
        replacements: { key: userData.id },
        type: QueryTypes.SELECT
    })
    // let i = (search[0].order_status = 1) ? "Order Placed but payment is not done " : (search[0].order_status = 2) ? "order placed and payment successfull" : (search[0].order_status = 3) ? "Cancelled by you" : (search[0].order_status = 4) ? "Cancelled by Admin " : (search[0].order_status = 5) ? "cancel order payment fail" : (search[0].order_status = 6) ? " Order Confirmed" : "Not available";

    for (let a of search) {
        a.order_status = (a.order_status == 0) ? "pending" : (a.order_status == 1) ? "Order Placed but payment is not done " : (a.order_status == 2) ? "order placed and payment successfull" : (a.order_status == 3) ? "Cancelled by you" : (a.order_status == 4) ? "Cancelled by Admin " : (a.order_status == 5) ? "cancel order payment fail" : (a.order_status == 6) ? " Order Confirmed" : (a.order_status == 7) ? "Order Cancelled Delivery Failed" : "Not available";

        a.payment_status = (a.payment_status == 0) ? "Pending" : (a.payment_status == 1) ? "Payment Successfull" : (a.payment_status == 2) ? "Payment Failed" : (a.payment_status == 3) ? "Payment cancel" : "Not Available";

        a.delivery_status = (a.delivery_status == 0) ? "pending" : (a.delivery_status == 1) ? "Arrived in warehouse" : (a.delivery_status == 2) ? "Dispatched From warehouse" : (a.delivery_status == 3) ? "out for delivery" : (a.delivery_status == 4) ? "Delivered" : (a.delivery_status == 5) ? "Delivery Failed" : (a.delivery_status == 6) ? "delivery Cancel" : "Not Available";
    }
    if (!search || search.error) {
        return { error: "Cant perform this action try again later" }
    }

    return { data: search }
}

function joiviewOrder(param) {
    let schema = joi.object({
        order_id: joi.number().min(1),
        user_id: joi.number().min(1)

    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }
}



async function viewALLorder(param) {
    let check = joiviewOrder(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let query = "SELECT user.name AS user_name,orders.id AS order_id ,dishes.name,dishes.image_path,orders.quantity,orders.price,orders.discount,orders.discounted_price,orders.total_price, orders.order_status, orders.payment_status,orders.delivery_status FROM orders LEFT JOIN dishes ON dishes.id = orders.product_id LEFT JOIN user ON orders.user_id = user.id ";
    if (param.order_id) {
        query += `where orders.id = ${param.order_id}`
    } else if (param.user_id) {
        query += `where user.id=${param.user_id}`
    }
    let search = await sequelize.query(query, {
        type: QueryTypes.SELECT
    }).catch((err) => {
        return { error: err }
    })
    for (let a of search) {
        a.order_status = (a.order_status == 0) ? "pending" : (a.order_status == 1) ? "Order Placed but payment is not done " : (a.order_status == 2) ? "order placed and payment successfull" : (a.order_status == 3) ? "Cancelled by you" : (a.order_status == 4) ? "Cancelled by Admin " : (a.order_status == 5) ? "cancel order payment fail" : (a.order_status == 6) ? " Order Confirmed" : (a.order_status == 7) ? "Order Cancelled Delivery Failed" : "Not available";

        a.payment_status = (a.payment_status == 0) ? "pending" : (a.payment_status == 1) ? "Payment Successfull" : (a.payment_status == 2) ? "Payment Failed" : (a.payment_status == 3) ? "payment cancel" : "Not Available";

        a.delivery_status = (a.delivery_status == 0) ? "Pending" : (a.delivery_status == 1) ? "Arrived in warehouse" : (a.delivery_status == 2) ? "Dispatched From warehouse" : (a.delivery_status == 3) ? "out for delivery" : (a.delivery_status == 4) ? "Delivered" : (a.delivery_status == 5) ? "Delivery Failed" : (a.delivery_status == 6) ? "delivery cancel" : "Not Available";
    }
    if (!search || search.error) {
        return { error: search.error }
    }
    return { data: search }

}

function paymentJoi(param) {

    let schema = joi.object({
        order_id: joi.number().min(1).required(),
        amount: joi.number().min(0).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }

}

async function pay(param, userData) {
    let check = paymentJoi(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let validate = await Order.findOne({
        where: {
            [Op.and]: [
                { id: param.order_id },
                { total_price: param.amount },
                { user_id: userData.id }]
        }
    }).catch((err) => {
        return { error: err }
    })
    console.log(validate)
    if (!validate || validate.error) {
        await Order.update({ order_status: 5, payment_status: 2 }, { where: { id: param.order_id, user_id: userData.id } }).catch((err) => {
            console.log(err)
        })
        return {
            error: {
                status: "failed",
                status_code: 2,
                payment_detail: "Failed"
            }
        }
    }
    let success = await Order.update({ order_status: 2, payment_status: 1 }, { where: { id: validate.id } }).catch((err) => {
        return { error: err }
    })
    if (!success || success.error) {
        return { error: "Internal server error" }
    }
    return {
        data: {
            status: "success",
            status_code: 1,
            payment_detail: "success"
        }
    }
}

function Joiconfirm(param) {

    let schema = joi.object({
        order_id: joi.number().min(1).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }

}

async function confirm(param, userData) {
    let check = Joiconfirm(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let con = await Order.findOne({ where: { id: param.order_id } }).catch((err) => {
        return { error: err }
    })
    if (!con || con.error) {
        return { error: "please enter proper order id" }
    }
    let confirm = await Order.update({ order_status: 6, confirmedBy: userData.id }, { where: { id: con.id } }).catch((err) => {
        return { error: err }
    })
    if (!confirm || confirm.error) {
        return { error: " Internal Server Error" }
    }
    let find = await User.findOne({ where: { id: con.user_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: find.error }
    }
    let mailoption = {
        from: "mohif.waghu@somaiya.edu",
        to: find.username,
        subject: "Order Confirmation Mail",
        text: `Your order is successfully confirmed order Id us : ${con.id}`
    };
    let sendMail = await email(mailoption).catch((err) => {
        return { error: err }
    })
    if (!sendMail || sendMail.error) {
        return { error: sendMail.error }
    }
    return { data: `Order confirm successfully of order Id: ${con.id}` }
}


function Joicancel(param) {

    let schema = joi.object({
        order_id: joi.number().min(1).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }

}

async function cancel(param, userData) {
    let check = Joicancel(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Order.findOne({ where: { id: param.order_id, user_id: userData.id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "something went wrong" }
    }
    let cancel = await Order.update({ order_status: 3, delivery_status: 6, payment_status: 3, cancelledBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })

    if (!cancel || cancel.error) {
        return { error: " Internal server error" }
    }
    return { data: "Order cancel successfullyyy" }
}

async function adminCancel(param, userData) {
    let check = Joicancel(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Order.findOne({ where: { id: param.order_id } }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "order id not found" }
    }
    let cancel = await Order.update({ order_status: 4, delivery_status: 6, payment_status: 3, cancelledBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!cancel || cancel.error) {
        return { error: " Internal server error" }
    }
    return { data: `Order cancel successfullyyy of order id:${find.id}` }
}

function JoiDelivery(param) {

    let schema = joi.object({
        order_id: joi.number().min(1).required(),
        delivery_status: joi.number().min(1).required()
    }).options({
        abortEarly: false
    })
    let check = schema.validate(param)
    if (check.error) {
        let error = []
        for (let err of check.error.details) {
            error.push(err.message)
        }
        return { error: error }
    }
    return { data: check.value }

}

async function delivery(param, userData) {
    let check = JoiDelivery(param)
    if (!check || check.error) {
        return { error: check.error }
    }
    let find = await Order.findOne({ where: { id: param.order_id }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return { error: "Order Id not found " }
    }
    let give = await Order.update({ delivery_status: param.delivery_status, updatedBy: userData.id }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!give || give.error) {
        return { error: "Internal Server Error" }
    }
    if (find.delivery_status == 5) {
        let ok = await Order.update({ order_status: 7 }, { where: { id: param.order_id } }).catch((err) => {
            return { error: err }
        })
        if (!ok || ok.error) {
            return { error: "Internal Server Error" }
        }
    }
    return { data: "Successfullyy updated" }
}

module.exports = {
    orderPlace,
    viewOrder,
    viewALLorder,
    pay,
    confirm,
    cancel,
    adminCancel,
    delivery
}