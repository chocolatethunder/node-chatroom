let express = require("express");
let app		= express();
let http	= require('http').Server(app);
let io		= require("socket.io")(http);
let parser	= require("socket.io-cookie-parser");
let jade 	= require("jade");
let path	= require("path");
let sass	= require("node-sass");
let fs		= require("fs");

io.use(parser());

// Load custom
let sserver = require("./socketserver.js")(io);
let routes 	= require("./routes/index");

// Middle-ware
app.set("views", path.join(__dirname, "views"));
app.set("view engine","jade");

// Route
app.use("/",routes);
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

http.listen(9000, function (){
	console.log("Listening on port 9000");
});