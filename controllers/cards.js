const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.status(200).json(cards);
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Неверный запрос' });
  }

  try {
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(201).json(card);
  } catch (error) {
    return next(error);
  }
};

const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    if (card.owner.toString() !== userId) {
      return res.status(403).send({ message: 'У вас нет прав для удаления этой карточки' });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    if (deletedCard) {
      return res.status(200).json(deletedCard);
    }
    return res.status(404).send({ message: 'Карточка не найдена' });
  } catch (error) {
    return next(error);
  }
};

const likeCard = async (req, res, next) => {
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
    next(error);
  }
};

const dislikeCard = async (req, res, next) => {
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
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
