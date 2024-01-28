const User = require('../models/user');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({message: 'Некорректный формат ID пользователя'});
    }

    try {
        const user = await User.findById(userId);

        if (user) {
            res.status(200).json({
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                _id: user._id,
            });
        } else {
            res.status(404).json({message: 'Пользователь не найден'});
        }
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const createUser = async (req, res) => {
    const {name, about, avatar} = req.body;

    if (!name || name.length < 2 || name.length > 30) {
        return res.status(400).json({error: 'Некорректная длина поля name'});
    }

    if (!about || about.length < 2 || about.length > 30) {
        return res.status(400).json({error: 'Некорректная длина поля about'});
    }

    if (!avatar) {
        return res.status(400).json({error: 'В запросе отсутствует обязательное поле avatar'});
    }

    try {
        const user = await User.create({name, about, avatar});
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: 'Неверный запрос'});
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const {name, about} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {name, about},
            {new: true}
        );

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({error: 'Пользователь не найден'});
        }
    } catch (error) {
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }
};

const updateAvatar = async (req, res) => {
    const userId = req.user._id;
    const {avatar} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {avatar},
            {new: true}
        );

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({error: 'Пользователь не найден'});
        }
    } catch (error) {
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }
};

module.exports = {getUsers, getUserById, createUser, updateProfile, updateAvatar};
