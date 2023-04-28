const express = require("express");
const {
  createUser,
  findUser,
  findUserById,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

const router = express.Router();

router.get("/users", findUser);

router.get("/users/:userId", findUserById);

router.post("/users", createUser);

router.patch("/users/me", updateUserProfile);

router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
