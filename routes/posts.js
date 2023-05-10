const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getPosts,
    getPostsByPersonId,
    addPost,
    likePost,
    dislikePost,
    getPostsOfFriends,
    getPostsTest,
} = require('../controllers/posts');

router.get('/posts', getPosts);
router.post(
    '/posts',
    celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string(),
        }),
    }),
    addPost,
);
router.get('/posts/me', getPostsOfFriends);
router.get('/posts/:userId', getPostsByPersonId);

router.put(
    '/posts/:postId/likes',
    celebrate({
        params: Joi.object().keys({
            postId: Joi.string().length(24).hex().required(),
        }),
    }),
    likePost,
);
router.delete(
    '/posts/:postId/likes',
    celebrate({
        params: Joi.object().keys({
            postId: Joi.string().length(24).hex().required(),
        }),
    }),
    dislikePost,
);

module.exports = router;
