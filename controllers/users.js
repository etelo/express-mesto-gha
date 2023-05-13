const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");
const ValidationError = require("../errors/validation-error");
const EmailError = require("../errors/email-error");

module.exports.getUserMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError(
          `Пользователь по указанному _id:${userId} не найден.`
        );
        next(error);
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => {
          res.status(200).send({
            data: {
              name,
              about,
              avatar,
              email,
            },
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new ValidationError("Некорректные данные"));
          } else if (err.code === 11000) {
            next(new EmailError("Данный email уже существует в базе данных"));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.findUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          `Пользователь по указанному _id:${userId} не найден.`
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ValidationError("Невалидный id"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new NotFoundError(
        `Пользователь с указанным _id:${userId} не найден.`
      );
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(
        new ValidationError(
          "Переданы некорректные данные при обновлении профиля."
        )
      );
    }
    next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new NotFoundError(
        `Пользователь с указанным _id:${userId} не найден.`
      );
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(
        new ValidationError(
          "Переданы некорректные данные при обновлении аватара."
        )
      );
    }
    next(err);
  }
};
