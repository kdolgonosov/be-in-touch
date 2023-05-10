const Post = require('../models/post');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ServerError = require('../errors/serverError');
const User = require('../models/user');

module.exports.getPosts = (req, res, next) => {
    const id = req.user._id;
    User.findOne({ _id: id }).then((user) => {
        Post.find()
            .where('owner')
            .in(user.friends)
            .populate('owner')
            .then((posts) => res.send(posts))
            .catch(() => {
                next(new ServerError());
            });
    });
};
module.exports.getPostsOfFriends = (req, res, next) => {
    Post.find({ owner: req.user._id })
        .populate('owner')
        .then((posts) => res.send(posts))
        .catch(() => {
            next(new ServerError());
        });
};
module.exports.getPostsByPersonId = (req, res, next) => {
    Post.find({ owner: req.params.userId })
        .populate('owner')
        .then((posts) => res.send(posts))
        .catch(() => {
            next(new ServerError());
        });
};

module.exports.addPost = (req, res, next) => {
    const { title, text, image } = req.body;
    Post.create({
        title,
        text,
        image,
        owner: req.user._id,
    })
        .then((post) => {
            Post.findById(post._id)
                .populate('owner')
                .then((post) => {
                    res.send(post);
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        return next(new ValidationError());
                    }
                    return next(new ServerError());
                });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return next(new ValidationError());
            }
            return next(new ServerError());
        });
};
module.exports.likePost = (req, res, next) => {
    Post.findByIdAndUpdate(
        req.params.postId,
        { $addToSet: { likes: req.user._id } },
        { new: true, runValidators: true },
    )
        .populate('owner')
        .then((post) => {
            if (!post) {
                return next(new NotFoundError());
            }
            return res.send(post);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new ValidationError());
            }
            return next(new ServerError());
        });
};

module.exports.dislikePost = (req, res, next) => {
    Post.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: req.user._id } },
        { new: true, runValidators: true },
    )
        .populate('owner')
        .then((post) => {
            if (!post) {
                return next(new NotFoundError());
            }
            return res.send(post);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                return next(new ValidationError());
            }
            return next(new ServerError());
        });
};
