const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();

//Passport config
//require("./config/passport")(passport);
// const adminCheck = require("./config/passport");
const { adminCheck, userCheck } = require("./config/passport");
userCheck(passport);
//adminCheck(passport);

//MIDDLEWARE
app.use(express.static("public"));
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));

//Expess Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");

  res.locals.error_msg = req.flash("error_msg");

  res.locals.error = req.flash("error");

  next();
});

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;

//MONGO connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("db connected!"))
  .catch((err) => console.log("db not connected!"));

//Routes
app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

app.listen(PORT, console.log("Server Has Started on Port 5000!"));
