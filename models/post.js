const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            validate: (v) => validator.isURL(v),
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'user',
            default: [],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('post', postSchema);
