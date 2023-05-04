const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getPosts, addPost, removePost } = require('../controllers/posts');

router.get('/posts', getPosts);
router.post(
    '/posts',
    celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().custom((value, helpers) => {
                if (validator.isURL(value)) {
                    return value;
                }
                return helpers.message('Поле image заполнено некорректно');
            }),
        }),
    }),
    addPost,
);
// router.delete(
//     '/posts/:postId',
//     celebrate({
//         params: Joi.object().keys({
//             postId: Joi.string().required(),
//         }),
//     }),
//     removePost,
// );

module.exports = router;
