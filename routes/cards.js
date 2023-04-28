const express = require("express");
const {
  createCard,
  findCards,
  findCardById,
  likeCard,
  dislikeCard,
  deleteCard,
} = require("../controllers/cards");

const router = express.Router();

router.get("/cards", findCards);

router.get("/cards/:cardId", findCardById);

router.post("/cards", createCard);

router.delete("/cards/:cardId", deleteCard);

router.put("/cards/:cardId/likes", likeCard);

router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
