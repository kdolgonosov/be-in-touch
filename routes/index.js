const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const userRouter = require('./users');
const postRouter = require('./posts');
const auth = require('../middlewares/auth');
const { createUser, signIn } = require('../controllers/users');

router.post('/signup', createUser);
router.post(
    '/signin',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
    }),
    signIn,
);

router.use(auth);
router.use('/', userRouter);
router.use('/', postRouter);

module.exports = router;
