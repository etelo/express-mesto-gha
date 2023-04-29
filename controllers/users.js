const User = require("../models/user");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = require("../utils/constants");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};

module.exports.findUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка на сервере." });
    });
};

module.exports.findUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь по указанному _id:${userId} не найден.`,
        });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};

module.exports.updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({
        message: `Пользователь с указанным _id:${userId} не найден.`,
      });
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: "Переданы некорректные данные при обновлении профиля.",
      });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Произошла ошибка на сервере." });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({
        message: `Пользователь с указанным _id:${userId} не найден.`,
      });
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({
        message: "Переданы некорректные данные при обновлении аватара.",
      });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Произошла ошибка на сервере." });
  }
};
