const Card = require("../models/card");
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = require("../utils/constants");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Карточка с указанным _id:${cardId} не найдена` });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для удаления карточки.",
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};

module.exports.findCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => {
      res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка на сервере." });
    });
};

// module.exports.findCardById = (req, res) => {
//   const { cardId } = req.params;
//   Card.findById(cardId)
//     .then((card) => {
//       if (!card) {
//         return res.status(HTTP_STATUS_NOT_FOUND).send({
//           message: `Карточка с указанным _id:${cardId} не найдена.`,
//         });
//       }
//       return res.status(HTTP_STATUS_OK).send(card);
//     })
//     .catch(() => {
//       res
//         .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
//         .send({ message: "Произошла ошибка на сервере." });
//     });
// };

module.exports.likeCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Передан несуществующий _id:${cardId} карточки.` });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};

module.exports.dislikeCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: `Передан несуществующий _id:${cardId} карточки.` });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для снятии лайка",
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Произошла ошибка на сервере." });
      }
    });
};
