const express = require("express");

const {
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} = require("../controllers/users");

const {
  validateUpdateUserProfile,
  validateUpdateUserAvatar,
  validateUserById,
} = require("../middlewares/validator");

const userRouter = express.Router();

userRouter.get("/me", getUserMe);

userRouter.get("/", findUsers);

userRouter.get("/:userId", validateUserById, findUserById);

userRouter.patch("/me", validateUpdateUserProfile, updateUserProfile);

userRouter.patch("/me/avatar", validateUpdateUserAvatar, updateUserAvatar);

module.exports = userRouter;
