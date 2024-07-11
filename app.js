const express = require("express");
const connectToDb = require("./database/databaseConnection.js");
const Blog = require("./model/blogModel.js");
const app = express();

const bcrypt = require("bcrypt");
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
  res.render("about.ejs", { name: name });
});
app.get("/edit", (req, res) => {
  res.render("blogs/editblog.ejs");
});

app.get("/contact", (req, res) => {
  res.render("blogs/contact.ejs");
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
  res.send("blog maded  sucessfully");
  // res.redirect("/");
});

app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("./blogs/singlepage", { blog: blog });
});

app.get("/deleteblog/:id", async (req, res) => {
  const id = req.params.id;

  const remove = await Blog.findByIdAndDelete(id);
  res.redirect("/");
});
app.get("/editblog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("./blogs/editblog.ejs", { blog });
});

app.post("/editblog/:id", async (req, res) => {
  const id = req.params.id;
  // const title = req.params.title;
  const { title, subtitle, description } = req.body;
  console.log(req.body);
  await Blog.findByIdAndUpdate(id, {
    title: title,
    subtitle: subtitle,
    description: description,
  });
  res.redirect("/singlepage/" + id);
});

/*/*/ /* */ /////////////////////////** *////////////////
// app.get("/myblog", async (req, res) => {
//   const myblog = await Blog.find({});

//   res.render("blogs/myblog.ejs", { myblog });
// }); // same as home page but different outlet
app.get("/singlepage/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  res.render("blogs/singlepage.ejs", { blog });
});

// app.get("/home", async (req, res) => {
// const blogs = await Blog.find();
// console.log(blogs);
// res.render("blogs/homepage.ejs", { blogs: blogs });
// });

// app.get("/form", (req, res) => {
//   res.render("form.ejs");
// });//

const User = require("./model/registerModel.js");

app.get("/register", (req, res) => {
  res.render("authentication/register.ejs");
});
app.post("/register", async (req, res) => {
  // const filename = req.file.filename;
  const { username, password, email } = req.body;
  console.log(username, password, email);
  const user = await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 12),
  });
  res.status(201).json({
    success: true,
    data: user,
    message: "Registered",
  });
  // res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("authentication/login.ejs");
});

app.post("/login", async (req, res) => {
  const { username,email, password } = req.body;
  const data = await User.find({ email, password });
  if (data.length == 0) {
    res.send("invalid user");
  } else {
    //check password
    const ismatched = bcrypt.compareSync(password, user[0].password);
    if (!ismatched) {
      res.send("invslid pappppa");
    } else {
      res.send("login sucessfully ");
    }
  }
});

app.listen(3000, () => {
  console.log("node has started at " + 3000 + " port ");
});
