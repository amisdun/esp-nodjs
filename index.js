const express = require("express")
const body_parser = require("body-parser")
const path = require("path")

let app = express()
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

// serving static files
app.use(express.static(__dirname + "/index.html")) //serving static 

// creating routers

app.get('/', function(req,res,next){
    // res.sendFile(path.join(__dirname + "/index.html"))
    return res.json({res: "welcome"})
})

app.post("/api/add_todo", function(req,res,next){
    let status = req.body.status

    if(status) res.json({res: "recieved", data: status})
})

let port;
if(process.env.NODE_ENV === "production"){port = process.env.PORT}
else port = 5000


app.listen(port, () => {
    console.log(`listening to port ${port}`)
})