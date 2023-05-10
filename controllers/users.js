const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const BadTokenError = require('../errors/badTokenError');
const NotFoundError = require('../errors/notFoundError');
const NotUniqueEmailError = require('../errors/notUniqueEmailError');
const ServerError = require('../errors/serverError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
    const { email, password, name, surname, age, city, university, avatar } = req.body;
    bcrypt
        .hash(password, 10)
        .then((hash) =>
            User.create({
                email,
                password: hash,
                name,
                surname,
                age,
                city,
                university,
                avatar,
            }),
        )
        .then((user) => {
            res.send({
                email: user.email,
                name: user.name,
            });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new ValidationError());
            }
            if (err.code === 11000) {
                return next(new NotUniqueEmailError());
            }
            return next(new ServerError());
        });
};

module.exports.signIn = (req, res, next) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign(
                { _id: user._id },
                NODE_ENV === 'production' ? JWT_SECRET : 'very-stronk-secret',
                {
                    expiresIn: '7d',
                },
            );

            res.send({ token });
        })
        .catch(() => next(new BadTokenError('Неверные почта или пароль')));
};

module.exports.followUser = (req, res, next) => {
    const _id = req.user._id;
    const { id } = req.body;
    User.findByIdAndUpdate(_id, { $push: { friends: [id] } }, { new: true })
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new ValidationError());
            }
            if (err.code === 11000) {
                return next(new NotUniqueEmailError());
            }
            return next(new ServerError());
        });
};
module.exports.unFollowUser = (req, res, next) => {
    const _id = req.user._id;
    const { id } = req.body;
    User.findByIdAndUpdate(_id, { $pull: { friends: { $eq: id } } }, { new: true })
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new ValidationError());
            }
            if (err.code === 11000) {
                return next(new NotUniqueEmailError());
            }
            return next(new ServerError());
        });
};
module.exports.getUserInfo = (req, res, next) => {
    const id = req.user._id;
    User.findById(id).then((user) => {
        if (!user) {
            return next(new NotFoundError());
        }
        return res.send({
            _id: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            age: user.age,
            city: user.city,
            university: user.university,
            avatar: user.avatar,
            friends: user.friends,
        });
    });
};
module.exports.getUserById = (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) =>
            res.send({
                _id: user._id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                age: user.age,
                city: user.city,
                university: user.university,
                avatar: user.avatar,
                friends: user.friends,
            }),
        )
        .catch(() => {
            next(new ServerError());
        });
};
module.exports.getAllUsers = (req, res, next) => {
    User.find({}).then((userList) => {
        if (!userList) {
            return next(new NotFoundError());
        }
        return res.send(userList);
    });
};

module.exports.getFriends = (req, res, next) => {
    const id = req.user._id;
    User.findById(id).then((user) => {
        User.find()
            .where('_id')
            .in(user.friends)
            .then((userList) => {
                if (!userList) {
                    return next(new NotFoundError());
                }
                return res.send(userList);
            });
    });
};

module.exports.updateUserInfo = (req, res, next) => {
    const id = req.user._id;
    const { name, surname, age, city, university, avatar } = req.body;
    User.findByIdAndUpdate(
        id,
        { name, surname, age, city, university, avatar },
        { new: true, runValidators: true },
    )
        .then((user) => {
            res.send({
                name: user.name,
                surname: user.surname,
                age: user.age,
                city: user.city,
                university: user.university,
                avatar: user.avatar,
                _id: user._id,
            });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new ValidationError());
            }
            if (err.code === 11000) {
                return next(new NotUniqueEmailError());
            }
            return next(new ServerError());
        });
};
