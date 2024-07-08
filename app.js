const express= require ("express")
const connectToDb=require("./database/databaseConnection.js")
const Blog = require("./model/blogModel.js") 
const app = express()

connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended  : true}))

app.set('view engine ','ejs ')
app.get("/",(req, res)=>{
    console.log(req)
    res.send("<h1>this is home</h1>")
})

app.get("/about",(req, res)=>{
  const name="ramesh"
    res.render("about.ejs",{name})
})

app.get("/blog", (req, res)=>{
    res.render("createblog.ejs")
})

 app.post("/blog",async (req, res)=> {
    
    const {title, subtitle, description }= req.body
    console.log(title, subtitle, description)
     await Blog.create({
        title, 
        subtitle,description,
    })


    res.send("bxlog sent sucessfully")
})

app.listen(3000,()=>{
    console.log("node has started"+3000)
})
app.get("/form", (req, res)=>{
    res.render("form.ejs") 
})
