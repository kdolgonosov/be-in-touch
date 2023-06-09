const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: (v) => validator.isEmail(v),
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    age: {
        type: String,
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    university: {
        type: String,
        minlength: 2,
        maxlength: 30,
    },
    avatar: {
        type: String,
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
        default: [],
    },
});
userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email })
        .select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
            }

            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    return Promise.reject(new Error('Неправильные почта или пароль'));
                }

                return user;
            });
        });
};

module.exports = mongoose.model('user', userSchema);
