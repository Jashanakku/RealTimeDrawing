const { socket } = require("engine.io");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port =3000;


//io is like a channel perssonal connection with each other
//so we need a broadcast connection.

//connect with index.html in public folder
app.use("/",express.static(__dirname + "/public"));

const onConnection = socket =>{
    socket.on("drawing",data => socket.broadcast.emit("drawing",data));     //broadcasting the data inside the drawing channel.
}

io.on("connection",onConnection);     //on means any event happens

http.listen(port,()=>{
    console.log("Server started in port " + port +".");
})

