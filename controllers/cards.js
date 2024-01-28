const Card = require('../models/card');

const getCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).send({message: 'Внутренняя ошибка сервера'});
    }
};

const createCard = async (req, res) => {
    const {name, link} = req.body;
    const ownerId = req.user._id;

    if (!name || name.length < 2 || name.length > 30) {
        return res.status(400).send({ message: 'Неверный запрос' });
    }

    try {
        const card = await Card.create({ name, link, owner: ownerId });
        res.status(201).json(card);
    } catch (error) {
        res.status(400).send({ message: 'Неверный запрос' });
    }
};

const deleteCardById = async (req, res) => {
    const cardId = req.params.cardId;

    try {
        const deletedCard = await Card.findByIdAndDelete(cardId);
        if (deletedCard) {
            res.status(200).json(deletedCard);
        } else {
            res.status(404).send({ message: 'Карточка не найдена' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    }
};

const likeCard = async (req, res) => {
    const cardId = req.params.cardId;
    const userId = req.user._id;

    try {
        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            {$addToSet: {likes: userId}},
            {new: true}
        );

        if (updatedCard) {
            res.status(200).json(updatedCard);
        } else {
            res.status(404).send({message: 'Карточка не найдена'});
        }
    } catch (error) {
        res.status(400).send({message: 'Внутренняя ошибка сервера'});
    }
};

const dislikeCard = async (req, res) => {
    const cardId = req.params.cardId;
    const userId = req.user._id;

    try {
        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            {$pull: {likes: userId}},
            {new: true}
        );

        if (updatedCard) {
            res.status(200).json(updatedCard);
        } else {
            res.status(404).send({message: 'Карточка не найдена'});
        }
    } catch (error) {
        res.status(400).send({message: 'Внутренняя ошибка сервера'});
    }
};

module.exports = {getCards, createCard, deleteCardById, likeCard, dislikeCard};
