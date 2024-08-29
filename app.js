const express = require("express");
const path = require("path");

const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const app = express();
const port = process.env.PORT || 5000;
app.use(compression());
app.use(morgan("dev"));

require("dotenv").config();
require("./config/database");
require("./config/database");
require("./models/user");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// const Visitor = require('./models/visitor');

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//use flash
app.use(flash());
const corsOptions = {
  origin: [
    /^(http:\/\/.+:8080)$/,
    /^(http:\/\/.+:80)$/,
    /^(http:\/\/.+:3000)$/,
    /^(http:\/\/.+:5000)$/,
  ],
  credentials: true,
  "Access-Control-Allow-Credentials": true,
};

app.use(cors(corsOptions));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(require("./routes"));
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
