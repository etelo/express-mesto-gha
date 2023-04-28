const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const app = express();

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

app.use((req, res, next) => {
  req.user = {
    _id: "644b8f771ec26db9b6823c11", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(userRouter, cardRouter);

app.listen(3000);
