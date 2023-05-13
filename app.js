const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const router = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { signUpValidation, signInValidation } = require('./middlewares/validator');

const app = express();
app.use(express.json());

app.post("/signin", signInValidation, login);
app.post("/signup", signUpValidation, createUser);
app.use(auth);

app.use(router);

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(3000);
