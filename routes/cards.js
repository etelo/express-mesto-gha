const express = require("express");
const {
  createCard,
  findCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require("../controllers/cards");

const cardRouter = express.Router();

cardRouter.get("/", findCards);

cardRouter.post("/", createCard);

cardRouter.delete("/:cardId", deleteCard);

cardRouter.put("/:cardId/likes", likeCard);

cardRouter.delete("/:cardId/likes", dislikeCard);

module.exports = cardRouter;
