const express = require("express")
const body_parser = require("body-parser")
const path = require("path")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
mongoose.Promise = global.Promise

let app = express()

const server = require("http").createServer(app)
const io = require("socket.io")(server)

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

// serving static files
app.use(express.static(__dirname + "/index.html")) //serving static 

//connecting to the database
mongoose.connect("mongodb://localhost:27017/iot",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

//creating admin signup schema
let schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    town: {
        type: String,
        required: true
    }
})

let admin_schema = mongoose.model("signup", schema)


// admin json auth

let admin_auth = async (req,res,next) => {
    jwt.verify(req.body.token, "shshshshshshshshshshsh",(err,decode) => {
        if(err) console.log(err);
        else{
            req.user = decode
            next()
        }
    })
}

let admin_signup = async (req,res,next) =>{ 
    try {
        let admin_email = await admin_schema.findOne({email: req.body.email}).exec()
         if(admin_email) return res.json({res: "found", msg: "email already exist"})
        else{
            let {hash} = await bcrypt.hash(req.body.password, 10)
            if(hash){
                await new admin_schema({
                    _id: new mongoose.Types.ObjectId,
                    email: req.body.email,
                    password: hash,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone_number: req.body.phone_number,
                    town: req.body.town
                }).save()
            }

            return res.json({res: "created", msg: "admin account created successfully"})
        }
    } catch (error) {
        console.log(error)
    }
}

let admin_signin = async (req,res, next) => {
    let signin = await admin_schema.findOne({email: req.body.email}).exec()
    if(signin){
        let {err,verify_password} = await bcrypt.compare(req.body.password, signin.password)
        if(err) console.log(err);
        if(verify_password === true){
            jwt.sign({id: signin._id, email: signin.email}, "shshshshshshshshshshsh",(err,token) => {
                if(err) console.log(err);
                if(token) return res.json({res: "success", data: token, msg: "Auth successful"})
            })
        }
        if(verify_password !== true) return res.json({res: "failed", msg: "Invalid Credentails"})
    }
    else return res.json({res: "failed", msg: "Invalid Credentails"})
}

//router for admin signup
app.post("/admin/signup", admin_signup)

//router for admin signin
app.post("/admin/signin",admin_signin)


app.get('/', (req,res,next) => {
    // res.sendFile(path.join(__dirname + "/index.html"))
    return res.json({res: "welcome"})
})

app.post("/api/add_todo",admin_auth, (req,res,next) => {
    let data = req.body.data
    if(data){
        ardiuno_data = data
        socket_data(ardiuno_data)
    }
    
})

let socket_data = (ardiuno_data) => {
    io.on("connection", (client) => {
        client.emit("data-from-ardiuno", ardiuno_data)
    })
}


let port;
if(process.env.NODE_ENV === "production"){port = process.env.PORT}
else{port = 5000}


server.listen(port, () => {
    console.log(`listening to port ${port}`)
})