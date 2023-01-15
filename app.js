const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const database = require("./common/SqlConnection");
const { Server } = require("socket.io");
const Port = 4000;

const app = express();
const server = http.createServer(app);
global.server = server;

const io = require("./common/socket");
const router = require("./routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);
});

app.use(router);

server.listen(Port, (err) => {
  if (err) console.log(err);
  console.log(`Server running on Port `, Port);
});

// app.listen(port);
// console.log(port + " Port Running");
