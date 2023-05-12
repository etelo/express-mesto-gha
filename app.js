const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const router = require("./routes/index");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.post("/signin", login);
app.post("/signup", createUser);
app.use(auth);

app.use(router);

app.use(errors());

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



app.listen(3000);
