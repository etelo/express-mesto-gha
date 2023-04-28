const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.findUser = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res.status(500).send({ message: "Ошибка по умолчанию." });
    });
};

module.exports.findUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Пользователь по указанному _id:${userId} не найден.`,
        });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ message: "Ошибка по умолчанию." });
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
      return res.status(404).send({
        message: `Пользователь с указанным _id:${userId} не найден.`,
      });
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля.",
      });
    }
    return res.status(500).send({ message: "Ошибка по умолчанию." });
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
      return res.status(404).send({
        message: `Пользователь с указанным _id:${userId} не найден.`,
      });
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при обновлении аватара.",
      });
    }
    return res.status(500).send({ message: "Ошибка по умолчанию." });
  }
};
