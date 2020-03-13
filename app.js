const socket = require("socket.io-client")("http://localhost:5000/")

socket.on("connect", function(){
    socket.on("data", function(data){
        console.log(data)
    })
})

