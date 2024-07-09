const express= require ("express")
const connectToDb=require("./database/databaseConnection.js")
const Blog = require("./model/blogModel.js") 
const app = express()
// require("./middleware/multerconfig.js").multer
const {multer, storage}= require ('./middleware/multerconfig.js')
const upload = multer({storage: storage})

connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended  : true}))
app.use(express.static("./images"))

app.set('view engine ','ejs')
app.get("/",async (req, res)=>{
    const blogs = await Blog.find()//alwYS REturns array 
    
    // if(blogs.length ==0)
    // {
    //     res.send('no blogs')
    // }
    console.log(blogs);
    res.render("blogs/homepage.ejs",{blogs:blogs})

})

app.get("/about",(req, res)=>{
  const name="ramesh"
    res.render("about.ejs",{name})
})

app.get("/blog", (req, res)=>{
    res.render("createblog.ejs")
})

 app.post("/blog",upload.single('image'),async (req, res)=> {
    const filename= req.file.filename
    const {title, subtitle, description }= req.body
    console.log(title, subtitle, description)
     await Blog.create({
        title, 
        subtitle,
        description,
        image:filename
    })
    res.send("bxlog sent sucessfully")
})
app.get("/home", async(req, res)=>{
    const blogs = await Blog.find()//alwYS REturns array 
    console.log(blogs)
    res.render("blogs/homepage.ejs",{blogs:blogs})
})



app.listen(3000,()=>{
    console.log("node has started"+3000)
})
app.get("/form", (req, res)=>{
    res.render("form.ejs") 
})
