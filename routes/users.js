const express = require("express");
const {
  createUser,
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

const userRouter = express.Router();

userRouter.get("/", findUsers);

userRouter.get("/:userId", findUserById);

userRouter.post("/", createUser);

userRouter.patch("/me", updateUserProfile);

userRouter.patch("/me/avatar", updateUserAvatar);

module.exports = userRouter;
