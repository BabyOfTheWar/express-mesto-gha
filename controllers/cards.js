const Card = require('../models/card');
const constants = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.status(constants.HTTP_STATUS.OK)
      .json(cards);
  } catch (error) {
    next(error);
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
    res.status(constants.HTTP_STATUS.CREATED)
      .json(card);
  } catch (error) {
    next(error);
  }
};

const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }

    if (card.owner.toString() !== userId) {
      return next({
        status: constants.HTTP_STATUS.NO_ACCESS,
        message: constants.ERROR_MESSAGES.NO_ACCESS,
      });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    if (deletedCard) {
      res.status(constants.HTTP_STATUS.OK)
        .json(deletedCard);
    } else {
      next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }
  } catch (error) {
    next(error);
  }
  return next();
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
      next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
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
      next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
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
