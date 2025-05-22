const express = require('express');
const router = express.Router();
const {
    getGroupMessages,
    sendGroupMessage,
    getMostActiveUsersInGroup,
    markAsRead
} = require('../repositories/MessageRepository');
const auth = require('../middleware/middleware.auth');

router.use(auth);
router.get('/:groupId', getGroupMessages);
router.post('/send', sendGroupMessage);
router.get('/:groupId/most-active', authMiddleware, getMostActiveUsersInGroup);
// router.put('/read', markAsRead);

module.exports = router;