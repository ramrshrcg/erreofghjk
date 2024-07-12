
const jwt= require("jsonwebtoken")
const User= require("../model/registerModel")
const promisify = require("util").promisify

const isAuthenticated= (req, res,next)=>{
    const token=req.cookies.token
    console.log(token)
    if(!token|| token== null)
    {
        return res.send("please login")

    }else{
        jwt.verify(token, process.env.SECRET,async(err, result)=>
        {
            if(err)
            {
                res.send("invalid token ")
            }else{
                // console.log("valid token ", result)
              const data =await  User.findById(result.UserId)
              if(!data){
                res.send("invalid userid in token ")
              }else{
                req.UserId= result.UserId
                next()
              }
            }
        })
        next()

    }
}
module.exports = isAuthenticated