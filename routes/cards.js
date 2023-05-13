const express = require("express");
const {
  createCard,
  findCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require("../controllers/cards");

const {
  validateCreateCard,
  validateCardId,
} = require("../middlewares/validator");

const cardRouter = express.Router();

cardRouter.get("/", findCards);

cardRouter.post("/", validateCreateCard, createCard);

cardRouter.delete("/:cardId", validateCardId, deleteCard);

cardRouter.put("/:cardId/likes", validateCardId, likeCard);

cardRouter.delete("/:cardId/likes", validateCardId, dislikeCard);

module.exports = cardRouter;
