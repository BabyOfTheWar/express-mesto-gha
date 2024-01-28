const express = require('express');
const {getCards, createCard, deleteCardById, likeCard, dislikeCard} = require('../controllers/cards');

const router = express.Router();

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
