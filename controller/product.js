let { dishAdd, dishUpdate,dishView,dishDelete, dishunDelete, dishBlock, dishUnblock } = require("../model/product")
let uploads = require("../helper/file")
let {Dish}= require("../schema/dishes")
let excel= require("../helper/excel")


async function addDish(request, response) {
    let file = await uploads(request, response, [{ name: "product", maxCount: 3 }], { destination: './product-images/', filesize: 3 * 1000 * 1000 }).catch((err) => {
        return { error: err }
    })
    if(!file || file.error){
        return response.status(500).send({error:file.error})
    }

    let data=[];
    for(let a of file.product){
        data.push(a.path)
    }

    let imagePath=data.join("   &  ")

    let add= await dishAdd(request.body,imagePath,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!add || add.error){
        return response.status(500).send({error:add.error})
    }
    return response.status(202).send({data:add.data})

}

async function updateDish(request,response){
    let file = await uploads(request, response, [{ name: "product", maxCount: 3 }], { destination: './product-images/', filesize: 3 * 1000 * 1000 }).catch((err) => {
        return { error: err }
    })
    if(!file || file.error){
        return response.status(500).send({error:file.error})
    }

    let data=[];
    for(let a of file.product){
        data.push(a.path)
    }

    let imagePath=data.join("   &  ")

    let update= await dishUpdate(request.body,imagePath,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!update || update.error){
        return response.status(501).send({error:update.error})
    }
    return response.status(202).send({data:update.data})
}

async function viewDish(request,response){
    let view= await dishView(request.body).catch((err)=>{
        return { error: err}
    })
    if(!view || view.error){
        return response.status(501).send({error:view.error})
    }
    return response.status(200).send({data: view.data})
}

async function deleteDish(request,response){
    let del= await dishDelete(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!del || del.error){
        return response.status(500).send({ error: del.error})
    }
    return response.status(200).send({data:del.data})

}

async function undeleteDish(request,response){
    let undel= await dishunDelete(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!undel || undel.error){
        return response.status(500).send({ error: undel.error})
    }
    return response.status(200).send({data:undel.data})

}

async function blockDish(request,response){
    let block= await dishBlock(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!block || block.error){
        return response.status(500).send({ error: block.error})
    }
    return response.status(200).send({data:block.data})

}

async function unblockDish(request,response){
    let unblock= await dishUnblock(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    if(!unblock || unblock.error){
        return response.status(500).send({ error: unblock.error})
    }
    return response.status(200).send({data:unblock.data})

}

async function exportProduct(request,response){
    let productData= await Dish.findAll({raw:true}).catch((err)=>{
        return { error: err}
    });
    if(!productData || productData.error){
        return response.status(500).send({error:"Internal Server Error"})
    }
    let columns=[
        { header: 'id', key: 'id', width: 10 },
        { header: 'name', key: 'name', width: 10 },
        { header: 'quantity', key: 'quantity', width: 10 },
        { header: 'price', key: 'price', width: 10 },
        { header: 'discount', key: 'discounted_price', width: 10 },
        { header: 'image_path', key: 'image_path', width: 10 },
        { header: 'stock_alert', key: 'stock_alert', width: 10 },
    ]

    let filename= "product";
    await excel(request,response,filename,columns,productData)
}


module.exports={
    addDish,
    updateDish,
    viewDish,
    deleteDish,
    undeleteDish,
    blockDish,
    unblockDish,
    exportProduct
}