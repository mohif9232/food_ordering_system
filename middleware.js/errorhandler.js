

let errorHandler= ( error , request , response , next)=>{
    let status=505;
    let data={
        message:"Internal Server Error",
        OriginalError:error.message 
    }
    response.status(status).send({status:"fail",error:data})
}


module.exports=  errorHandler