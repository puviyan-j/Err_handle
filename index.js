const express = require("express")
const app = express()
const mongoose = require("mongoose")
const data_schema = require("./schema")
const bcrypt = require("bcrypt")
const jst = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const errhandle = require("./error_handle")
const token = "jhonwick"

mongoose.connect("mongodb://127.0.0.1:27017/puvi")
    .then(() => {
        console.log("db is connected")
    })
    .catch(() => {
        console.log("db is not connected");
    })

app.use(express.json())



app.use(cookieParser())

app.use((err,req,res,next)=>{
       const errstatus = err.status|| 500;
       const errmsg  = err.message|| "undifind error"
    
      return res.status(errstatus).json({status:errstatus,message:errmsg})

})

app.post("/creat", async (req, res,next) => {
    const password = await bcrypt.hash(req.body.password, 7)
    const data = new data_schema({
        ...req.body, password: password,
    })
    const email = await data_schema.findOne({ email: req.body.email })
    if (email) return next(errhandle("",""))

   

    const save = await data.save()


    res.json(save)


})

app.post("/login", async (req, res,next) => {
    const email = await data_schema.findOne({ email: req.body.email })
    if (!email) return res.json("email is incorrect")
    // next(errorhandle("401","email is incorrect"))
    const password = await bcrypt.compare(req.body.password, email.password)
    if (!password) return res.json("password is incorrect")
    // next(errorhandle("401","password is incorrect"))

    const tokens = jst.sign({email:email._id},token)
    // res.json({token:tokens,message:"token is "})
    res.cookie("cookie",tokens,{httpOnly:true}).json("login succesfull")
})

app.get("/view", async (req, res) => {
    const view = await data_schema.find()
    res.json(view)

})




app.listen(3005, () => {
    console.log("server is running")
})