const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

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
    // вставьте сюда _id созданного в предыдущем пункте пользователя
    _id: "644b8f771ec26db9b6823c11",
  };
  next();
});

app.use(express.json());
app.use(router);

app.listen(3000);
