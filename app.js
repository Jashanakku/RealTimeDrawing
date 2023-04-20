const express = require("express");
const app = express();
const port =3000;

//connect with index.html in public folder
app.use("/",express.static(__dirname + "/public"));

// app.get("/",(req,res)=>{
//     res.json("Hello Everyone!");
// })

app.listen(port,()=>{
    console.log("Server started in port " + port +".");
})