const mongoose= require ("mongoose")

const Schema=mongoose.Schema
const userSchema=new Schema({
    username:{
        type: String
    }, 
    password: {
        type : String
    },
    email:{
        type: String
    },
})

const userdetails =mongoose.model("user", userSchema)
module.exports= userdetails