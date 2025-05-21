const express = require('express');
const authMiddleware = require('../middleware/middleware.auth');
const router = express.Router();
const {
    register,
    login,
    getUser,
    changeName,
    deleteAccount,
    getAllUsers,
    getUserByUsername,
    logout,
    getActivityStats,
    getUserActivity
} = require('../repositories/UserRepository');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getUser);
router.put('/changename/:id', changeName);
router.delete('/delete/:id', deleteAccount);
router.get('/all', getAllUsers);
router.get('/username/:username', authMiddleware, getUserByUsername);

router.post('/logout', authMiddleware, logout);
router.get('/activity/stats', authMiddleware, getActivityStats);
router.get('/activity/:id', authMiddleware, getUserActivity);

module.exports = router;