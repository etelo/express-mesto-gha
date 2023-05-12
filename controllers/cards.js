const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-error");
const DeleteCardError = require("../errors/delete-card-error");
const ValidationError = require("../errors/validation-error");

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    if (!name || !link) {
      throw new ValidationError('Поля "name" и "link" должны быть заполнены');
    }
    const card = await Card.create({ name, link, owner });
    res.status(201).send({ data: card });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(
        new ValidationError(
          "Переданы некорректные данные при создании карточки."
        )
      );
    } else {
      next(err);
    }
  }
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Карточка с указанным _id:${cardId} не найдена`
        );
      }
      if (card.owner.toString() !== req.user._id) {
        throw new DeleteCardError("Чужая карточка не может быть удалена");
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для удаления карточки."
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.findCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Передан несуществующий _id:${cardId} карточки.`
        );
      }

      res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для постановки лайка"
          )
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(
          `Передан несуществующий _id:${cardId} карточки.`
        );
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ValidationError("Переданы некорректные данные для снятии лайка")
        );
      } else {
        next(err);
      }
    });
};
