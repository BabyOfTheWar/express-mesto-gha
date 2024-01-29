const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверный запрос' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Неверный запрос' });
  }

  try {
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Неверный запрос' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (deletedCard) {
      res.status(200).json(deletedCard);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Некорректный формат ID карточки' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  }
};

const likeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    );

    if (updatedCard) {
      res.status(200).json(updatedCard);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Некорректный формат ID карточки' });
    } else if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверный запрос' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  }
};

const dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    );

    if (updatedCard) {
      res.status(200).json(updatedCard);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(400).send({ message: 'Некорректный формат ID карточки' });
    } else if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Неверный запрос' });
    } else {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
  }
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
