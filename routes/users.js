const express = require("express");

const {
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} = require("../controllers/users");

const userRouter = express.Router();

userRouter.get('/me', getUserMe);

userRouter.get("/", findUsers);

userRouter.get("/:userId", findUserById);

userRouter.patch("/me", updateUserProfile);

userRouter.patch("/me/avatar", updateUserAvatar);

module.exports = userRouter;
