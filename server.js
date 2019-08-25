const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// App Configurations
const config = {
  APP_NAME: "User Authentication",
  HOST: "localhost",
  PORT: process.env.PORT || 4500
};

const baseURL = `http://${config.HOST}:${config.PORT}`;

// Mongoose Connection
mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: "userAuth"
  })
  .then(() => console.log("Connected to Mongodb"))
  .catch(err => console.log(`Mongodb Server Error ${err}`));

// User Schema
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    require: true
  },
  lname: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  pass: {
    type: String,
    require: true
  }
});

// User Model
const User = mongoose.model("User", userSchema);

// Initialized express app
const app = express();

// App Middlewares

// Static File Base Path
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Set View Engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));

// Our Routes start here
app.get("/signup", (req, res) => {
  res.render("signup", { title: config.APP_NAME });
});

app.post("/signup", async (req, res) => {
  let params = req.body;
  console.log(req);
  if ("register" === params.action) {
    if (params.pass === params.re_pass) {
      let fname, lname, username, email, pass;
      fname = params.fname;
      lname = params.lname;
      username = params.username;
      email = params.email;
      pass = params.pass;
      let person = new User({
        fname: fname,
        lname: lname,
        username: username,
        email: email,
        pass: pass
      });

      await person.save((err, data) => {
        if (err) return console.log(err);
        res.send({
          data: data
        });
      });
    } else {
      res.send({
        message: "Registration Error"
      });
    }
  }
});

// App Would listen either Port 4500 or any other port that
// could be defined via environment variable
app.listen(config.PORT, () =>
  console.log(`App is running on port ${config.PORT}`)
);
