const express = require("express")
const body_parser = require("body-parser")
const path = require("path")
const cors = require("cors")

let app = express()
app.use(cors())
const socket_server = require("http").createServer(app)

const io = require("socket.io")(socket_server);

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: false}))

// serving static files
// app.use(express.static(__dirname + "/index.html")) //serving static 

// creating routers

io.on("connection", (socket) => {
        socket.emit("data", "get this data")
    })

app.get('/', function(req,res,next){
    // res.sendFile(path.join(__dirname + "/index.html"))
    return res.json({res: "welcome"})
})

app.post("/api/add_todo", function(req,res,next){
    // let status = req.body.status

    return res.json({res: "recieved"})
})

let port;

if(process.env.NODE_ENV === "production"){port = process.env.PORT}
else port = 5000


socket_server.listen(port, () => {
    console.log(`listening to port ${port}`)
})