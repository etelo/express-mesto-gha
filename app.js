const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();

const { login, createUser } = require("./controllers/users");
const auth = require('./middlewares/auth');

app.post("/signin", login);
app.post("/signup", createUser);
app.use(auth);

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

app.use(express.json());
app.use(router);

app.listen(3000);
