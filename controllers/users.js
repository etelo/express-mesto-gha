const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");
const ValidationError = require("../errors/validation-error");
const EmailError = require("../errors/email-error");

const { JWT_SECRET, NODE_ENV } = process.env;

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
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "JWT_SECRET",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((newUser) =>
          res.status(201).send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
            _id: newUser._id,
          })
        )
        .catch((err) => {
          if (err.code === 11000) {
            next(new EmailError("Данный email уже существует в базе данных"));
            return;
          }
          if (err.name === "ValidationError") {
            next(new ValidationError("Некорректные данные"));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь с таким id не найден"));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError("Некорректный id"));
        return;
      }
      next(err);
    });
};

module.exports.updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(`Пользователь с указанным _id:${userId} не найден.`)
        );
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
        return;
      }
      next(err);
    });
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(
          new NotFoundError(`Пользователь с указанным _id:${userId} не найден.`)
        );
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при обновлении аватара."
          )
        );
        return;
      }
      next(err);
    });
};
