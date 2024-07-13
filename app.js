require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/databaseConnection.js");
const Blog = require("./model/blogModel.js");
const app = express();
const jwt = require("jsonwebtoken");
const isAuthenticated = require("./middleware/isAuthenticated.js");
const cookieParser= require('cookie-parser')
const bcrypt = require("bcrypt");
const User = require("./model/registerModel.js");
const { multer, storage } = require("./middleware/multerconfig.js");
const upload = multer({ storage: storage });

connectToDb();  

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine ", "ejs");

app.use(express.static("./storage"));

// Middleware to pass user status to views
app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.SECRET);
          const user = await User.findById(decoded.userId);
          if (user) {
              req.user = { userId: decoded.userId, username: user.username };
          }
      } catch (err) {
          res.clearCookie("token");
      }
  }
  res.locals.user = req.user;
  next();
});

app.get("/", async (req, res) => {
  const blogs = await Blog.find(); //alwYS REturns array

  // console.log(blogs);
  res.render("blogs/homepage.ejs", { blogs: blogs });
});

app.get("/about", (req, res) => {
  const name = "ramesh";
  res.render("about.ejs", { name: name });
});
app.get("/edit",async (req, res) => {
  const blog=await Blog.find()
  res.render("blogs/editblog.ejs",{blog});
});

app.get("/contact", (req, res) => {
  res.render("blogs/contact.ejs");
});

app.get("/createblog",isAuthenticated, (req, res) => {
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
    author: req.user.username,
  });
  //res.send("blog maded  sucessfully");
   res.redirect("/");
});

app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  res.render("./blogs/singlepage", { blog: blog });
});

app.get("/deleteblog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  if (!blog || blog.author !== req.user.username) {
    return res.status(403).send("You are not authorized to delete this blog.");
  }
  await Blog.findByIdAndDelete(id);


  res.redirect("/");
});
app.get("/editblog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  if (!blog || blog.author !== req.user.username) {
    return res.status(403).send("You are not authorized to edit this blog.");
}

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
app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
      return res.redirect("/");
  }

  const blogs = await Blog.find({
      $or: [
          { title: new RegExp(query, 'i') },
          { subtitle: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') },
          { author: new RegExp(query, 'i') }
      ]
  });

  res.render("search.ejs", { blogs: blogs, query: query });
});

// 
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

app.get("/home", async (req, res) => {
const blogs = await Blog.find();
console.log(blogs);
res.render("blogs/homepage.ejs", { blogs: blogs });
});

app.get("/form", (req, res) => {
  res.render("form.ejs");
});//


app.get("/register", (req, res) => {

  res.render("authentication/register.ejs");
});
app.get("/login", (req, res) => {
  res.render("authentication/login.ejs");
});
app.post("/register", async (req, res) => {
  // const filename = req.file.filename;
  const { username, password, email } = req.body;
  console.log(username, password, email);
  await User.create({
    username,
    email,
    password: bcrypt.hashSync(password, 12),
  });
  // res.status(201).json({
  //   success: true,
  //   data: user,
  //   message: "Registered",
  // });
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const userdata = await User.findone({ email, });
  const user = await User.find({ email });

  // Use .find when you expect multiple documents to match the query (e.g., retrieving all users from a particular city).
  /*The findOne method returns a single document or null, not an array, so you don't need to check .length or access it like an array.*/
  if (user.length === 0) {
    res.send("invalid email");
  } else {
    //check password
    const isMatched = bcrypt.compareSync(password, user[0].password);
    if (!isMatched) {
      res.send("Invalid password");
    } else {
      const token = jwt.sign({ userId: user[0]._id }, process.env.SECRET, {
        expiresIn: "20d",
      });
      res.cookie("token", token)
      // res.send("logged in successfully");
      res.redirect("/home")
    }
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
}); 


app.listen(3000, () => {
  console.log("node has started at " + 3000 + " port ");
});
