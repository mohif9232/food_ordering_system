let { dishView } = require("../model/product")
let { orderPlace, viewOrder, viewALLorder, pay, confirm, cancel, adminCancel, delivery } = require("../model/order")

async function placeOrder(request, response) {
    let data = await dishView(request.body).catch((err) => {
        return { error: err }
    })
    if (!data || data.error) {
        return response.status(500).send({ error: data.error })
    }

    let place = await orderPlace(request.body, data.data[0], request.userData).catch((err) => {
        return { error: err }
    })
    if (!place || place.error) {
        return response.status(500).send({ error: place.error })
    }
    return response.status(200).send({ data: place })
}


async function orderView(request, response) {
    let find = await viewOrder(request.userData).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(500).send({ error: find.error })
    }
    return response.status(200).send(find)
}

async function orderAllview(request, response) {
    let find = await viewALLorder(request.body).catch((err) => {
        return { error: err }
    })
    console.log(find)
    if (!find || find.error) {
        return response.status(500).send({ error: find.error })
    }
    return response.status(200).send(find)
}

async function payment(request, response) {
    let find = await pay(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    console.log(find)
    if (!find || find.error) {
        return response.status(505).send({ error: find.error })
    }
    return response.status(200).send({ data: find })
}

async function confirmOrder(request, response) {
    let find = await confirm(request.body, request.userData).catch((err) => {
        return { error: err }
    })

    if (!find || find.error) {
        return response.status(505).send({ error: find.error })
    }
    return response.status(200).send({ data: find })
}

async function cancelOrder(request, response) {
    let find = await cancel(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(505).send({ error: find.error })
    }
    return response.status(200).send({ data: find })
}

async function cancelOrderAdmin(request, response) {
    let find = await adminCancel(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(505).send({ error: find.error })
    }
    return response.status(200).send({ data: find })
}

async function delivery_status(request, response) {
    let find = await delivery(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(505).send({ error: find.error })
    }
    return response.status(200).send({ data: find })
}

module.exports = {
    placeOrder,
    orderView,
    orderAllview,
    payment,
    confirmOrder,
    cancelOrder,
    cancelOrderAdmin,
    delivery_status
}