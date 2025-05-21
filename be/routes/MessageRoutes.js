const express = require('express');
const router = express.Router();
const {
    getGroupMessages,
    sendGroupMessage,
    markAsRead
} = require('../repositories/MessageRepository');

router.get('/:groupId', getGroupMessages);
router.post('/send', sendGroupMessage);
// router.put('/read', markAsRead);

module.exports = router;