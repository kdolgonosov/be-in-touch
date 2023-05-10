const router = require('express').Router();
const {
    getUserInfo,
    followUser,
    unFollowUser,
    updateUserInfo,
    getAllUsers,
    getFriends,
    getUserById,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserInfo);
router.get('/users', getAllUsers);
router.get('/users/friends', getFriends);
router.get('/users/:userId', getUserById);
router.patch('/users', followUser);
router.delete('/users', unFollowUser);

module.exports = router;
