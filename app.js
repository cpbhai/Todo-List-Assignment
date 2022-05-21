const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "/config", ".env") });
const route = require("./routes");
const app = express();

const cors = require("cors");
const expressSanitizer = require("express-sanitizer");
const logger = require("morgan");

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(logger("dev"));
// app.use(fileUpload());
app.use(cookieParser());
app.use(cors());

app.use(expressSanitizer());
require("./config/DBConnect");

app.use("/api/v1", route);
app.use("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is working fine." });
});

app.use(function (req, res) {
  res.send("404 No Such Resource Found");
});

const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log("Express app running on port " + port);
});
