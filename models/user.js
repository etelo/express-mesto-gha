const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const NotAuthorized = require("../errors/not-authorized");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      minlength: 2,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: [
        {
          validator: (v) =>
            /^(http:\/\/|https:\/\/)?(www\.)?[\w\-.]+(\.\w+)+(\/[\w\-.~:/?#[\]@!$&'()*+,;=]*)?#?$/.test(
              v
            ),
          message: "Неправильный адрес ссылки",
        },
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Неверный формат email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new NotAuthorized("Неправильные почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new NotAuthorized("Неправильные почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
