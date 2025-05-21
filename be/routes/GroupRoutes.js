const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/middleware.auth');
const {
    createGroup,
    addMember,
    getGroupTodos,
    getUserGroups,
    getGroupDetails,
    removeMember
} = require('../repositories/GroupRepository');

router.post('/create', authMiddleware, createGroup);
router.put('/add-member', authMiddleware, addMember);
router.get('/todos/:groupId', authMiddleware, getGroupTodos);
router.get('/user/:userId', authMiddleware, getUserGroups);
router.get('/details/:groupId', authMiddleware, getGroupDetails);
router.put('/remove-member', authMiddleware, removeMember);

module.exports = router;