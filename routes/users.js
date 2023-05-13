const express = require("express");

const {
  findUsers,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserMe,
} = require("../controllers/users");

const {
  patchUserMeValidation,
  patchUserAvatarValidation,
  userIdValidation,
} = require("../middlewares/validator");

const userRouter = express.Router();

userRouter.get("/me", userIdValidation, getUserMe);

userRouter.get("/", findUsers);

userRouter.get("/:userId", findUserById);

userRouter.patch("/me", patchUserMeValidation, updateUserProfile);

userRouter.patch("/me/avatar", patchUserAvatarValidation, updateUserAvatar);

module.exports = userRouter;
