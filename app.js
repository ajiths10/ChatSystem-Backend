const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const database = require("./common/SqlConnection");
const port = 4000;

const app = express();

const router = require("./routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

app.use(router);

app.listen(port);
console.log(port + " Port Running");
