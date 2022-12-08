let { cartAdd,cartUpdate ,cartView , cartRemove}= require("../model/cart")

async function addCart(request,response){
    let add= await cartAdd(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    console.log(add)
    if(!add || add.error){
        return response.status(401).send(add.error)
    }
    return response.status(200).send(add)
}

async function updateCart(request,response){
    let update= await cartUpdate(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
    
    if(!update || update.error){
        return response.status(500).send(update.error)
    }
    return response.status(200).send(update)
}

async function viewCart(request,response){
    let find= await cartView(request.userData).catch((err)=>{
        return { error: err}
    })
   
    if(!find || find.error){
        return response.status(401).send(find.error)
    }
    return response.status(200).send(find)
}

async function removeCart(request,response){
    let remove= await cartRemove(request.body,request.userData).catch((err)=>{
        return { error: err}
    })
   
    if(!remove || remove.error){
        return response.status(401).send(remove.error)
    }
    return response.status(200).send(remove)
}


module.exports= { addCart,updateCart ,viewCart , removeCart}