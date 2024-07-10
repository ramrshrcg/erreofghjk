const express = require("express");
const connectToDb = require("./database/databaseConnection.js");
const Blog = require("./model/blogModel.js");
const app = express();
// require("./middleware/multerconfig.js").multer
const { multer, storage } = require("./middleware/multerconfig.js");
const upload = multer({ storage: storage });

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine ", "ejs");
app.use(express.static("./storage"));

app.get("/", async (req, res) => {
  const blogs = await Blog.find(); //alwYS REturns array

  // console.log(blogs);
  res.render("blogs/homepage.ejs", { blogs: blogs });
});

app.get("/about", (req, res) => {
  const name = "ramesh";
  res.render("about.ejs", { name });
});

app.get("/createblog", (req, res) => {
  res.render("createblog.ejs");
});   

app.post("/createblog", upload.single("image"), async (req, res) => {
  const filename = req.file.filename;
  const { title, subtitle, description } = req.body;
  console.log(title, subtitle, description);
  await Blog.create({
    title,
    subtitle,
    description,
    image: filename,
  });
  res.send("bxlog maded  sucessfully");
  res.redirect("/")
});

app.get("/blog/:id",async (req,res)=>{
  const id = req.params.id
  const blog = await Blog.findById(id)
  res.render("./blogs/singlepage",{blog:blog})
})

app.get("/deleteblog/:id",async (req,res)=>{
  const id = req.params.id 
  await Blog.findByIdAndDelete(id)
  res.redirect("/")
})
app.get("/editblog/:id",(req,res)=>{
    res.render("./blogs/editBlog")
})

 /*/*/ /* *//////////////////////////** *////////////////
app.get("/myblog", async (req, res) => {
  const myblog = await Blog.find({});

  res.render("blogs/myblog.ejs", { myblog });
});

// app.get("/home", async (req, res) => {
  // const blogs = await Blog.find();
  // console.log(blogs);
  // res.render("blogs/homepage.ejs", { blogs: blogs });
// });




// app.get("/form", (req, res) => {
//   res.render("form.ejs");
// });//deleted form page


app.listen(3000, () => {
  console.log("node has started" + 3000);
});
