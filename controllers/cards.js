const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(404).send({
          message: `Карточка с указанным _id:${cardId} не найдена.`,
        });
      }
      return res.send({ data: deletedCard });
    })
    .catch(() => {
      res.status(500).send({ message: "Ошибка по умолчанию" });
    });
};

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные.",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.findCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: `Карточка с указанным _id:${cardId} не найдена.`,
        });
      }
      return res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: "Ошибка по умолчанию." });
    });
};

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
          .status(404)
          .send({ message: `Передан несуществующий _id:${cardId} карточки.` });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию." });
      }
    });
};

module.exports.dislikeCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  if (!cardId) {
    return res.status(400).send({
      message: "Переданы некорректные данные для снятии лайка.",
    });
  }

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedCard) {
      return res
        .status(404)
        .send({ message: `Передан несуществующий _id:${cardId} карточки.` });
    }
    return res.send(updatedCard);
  } catch (err) {
    return res.status(500).send({ message: "Ошибка по умолчанию." });
  }
};
