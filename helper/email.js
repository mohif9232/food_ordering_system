let mail= require("nodemailer")

async function email(mailoption){
    return new Promise((resolve,reject)=>{
       let transporter= mail.createTransport({
        service:"gmail",
        auth:{
            user:"mohif.waghu@somaiya.edu",
            pass:"jipbczhcaefrlmhn"
        }

        })

        transporter.sendMail(mailoption,(error,info)=>{
            if(error){
                reject(false)
            }
            else{
                resolve("mail send",true)
            }
        })
    })
}

module.exports= {email}