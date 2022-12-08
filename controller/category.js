let {categoryAdd,categoryUpdate,viewCategory,softDeletecat,softUndeletecat,activeCat,unActivecat}= require("../model/category")

async function addCategory(request,response){
    let add= await categoryAdd(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    console.log(add)
    if(!add || add.error){
        return response.status(500).send({error:add.error})
    }
    return response.status(200).send({data:add.data})
}

async function updateCategory(request,response){
    let update= await categoryUpdate(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    if(!update || update.error){
        return response.status(500).send({error:update.error})
    }
    return response.status(200).send({data:update.data})
}

async function categoryView(request,response){
    let view= await viewCategory(request.body).catch((err)=>{
        return { error : err}
    })

    if(!view || view.error){
        return response.status(500).send({error:view.error})
    }
    return response.status(200).send({data:view.data})
}

async function deleteCategory(request,response){
    let update= await softDeletecat(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    if(!update || update.error){
        return response.status(500).send({error:update.error})
    }
    return response.status(200).send({data:update.data})
}

async function UndeleteCategory(request,response){
    let update= await softUndeletecat(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    if(!update || update.error){
        return response.status(500).send({error:update.error})
    }
    return response.status(200).send({data:update.data})
}

async function activeCategory(request,response){
    let update= await activeCat(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    if(!update || update.error){
        return response.status(500).send({error:update.error})
    }
    return response.status(200).send({data:update.data})
}

async function unactiveCategory(request,response){
    let update= await unActivecat(request.body,request.userData).catch((err)=>{
        return { error : err}
    })
    if(!update || update.error){
        return response.status(500).send({error:update.error})
    }
    return response.status(200).send({data:update.data})
}


module.exports={
    addCategory,
    updateCategory,
    categoryView,
    deleteCategory,
    UndeleteCategory,
    activeCategory,
    unactiveCategory
}