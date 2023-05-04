const Post = require('../models/post');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const ServerError = require('../errors/serverError');

module.exports.getPosts = (req, res, next) => {
    Post.find({ owner: req.user._id })
        .then((cards) => res.send({ posts: cards }))
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
            res.send(post);
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
// module.exports.removePost = (req, res, next) => {
//     Post.findById(req.params.postId)
//         .orFail(() => next(new NotFoundError('Фильм не найден')))
//         .then((post) => {
//             if (!post.owner.equals(req.user._id)) {
//                 return next(new ForbiddenError());
//             }
//             return post.remove().then(() => res.send(post));
//         })
//         .catch((err) => {
//             if (err.name === 'CastError') {
//                 return next(new ValidationError());
//             }
//             return next(new ServerError());
//         });
// };
