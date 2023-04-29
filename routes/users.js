const express = require("express");
const {
  createUser,
  findUser,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

const userRouter = express.Router();

userRouter.get("/users", findUser);

userRouter.get("/users/:userId", findUserById);

userRouter.post("/users", createUser);

userRouter.patch("/users/me", updateUserProfile);

userRouter.patch("/users/me/avatar", updateUserAvatar);

module.exports = userRouter;
