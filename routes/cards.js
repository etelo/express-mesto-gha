const express = require("express");
const {
  createCard,
  findCards,
  findCardById,
  likeCard,
  dislikeCard,
  deleteCard,
} = require("../controllers/cards");

const cardRouter = express.Router();

cardRouter.get("/cards", findCards);

cardRouter.get("/cards/:cardId", findCardById);

cardRouter.post("/cards", createCard);

cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.put("/cards/:cardId/likes", likeCard);

cardRouter.delete("/cards/:cardId/likes", dislikeCard);

module.exports = cardRouter;
