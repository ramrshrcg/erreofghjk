const express= require ("express")
const app = express()
app.set('view engine ','ejs ')
app.get("/",(req, res)=>{
    console.log(req)
    res.send("<h1>this is home</h1>")
})
app.get("/about",(req, res)=>{
  const name="ramesh"
    res.render("about.ejs",{name})
})


app.listen(3000,()=>{
    console.log("node has started"+3000)
})
app.get("/form", (req, res)=>{
    res.render("form.ejs") 
})
