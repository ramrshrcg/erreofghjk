const mongoose = require ("mongoose")

 async function connectToDb(){

  //  await  mongoose.connect("mongodb+srv://ramrshrcg:z7klrbZEWXzWx5gA@cluster0.wyanlje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

     await  mongoose.connect("mongodb://localhost:27017")
   console.log("Database connected")
}

module.exports=connectToDb