const Card = require('../models/card');
const constants = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.status(constants.HTTP_STATUS.OK)
      .json(cards);
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const ownerId = req.user._id;

  try {
    const card = await Card.create({
      name,
      link,
      owner: ownerId,
    });
    return res.status(constants.HTTP_STATUS.CREATED)
      .json(card);
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
      return res.status(constants.HTTP_STATUS.NOT_FOUND)
        .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
    }

    if (card.owner.toString() !== userId) {
      return res.status(constants.HTTP_STATUS.NO_ACCESS)
        .send({ message: constants.ERROR_MESSAGES.NO_ACCESS });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    if (deletedCard) {
      return res.status(constants.HTTP_STATUS.OK)
        .json(deletedCard);
    }
    return res.status(constants.HTTP_STATUS.NOT_FOUND)
      .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
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
      {
        new: true,
        runValidators: true,
      },
    );

    if (updatedCard) {
      res.status(constants.HTTP_STATUS.OK)
        .json(updatedCard);
    } else {
      res.status(constants.HTTP_STATUS.NOT_FOUND)
        .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
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
      {
        new: true,
        runValidators: true,
      },
    );

    if (updatedCard) {
      res.status(constants.HTTP_STATUS.OK)
        .json(updatedCard);
    } else {
      res.status(constants.HTTP_STATUS.NOT_FOUND)
        .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
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
