const express = require('express');
const router = express.Router();
const {
    createList,
    getListByUser,
    getAllLists,
    updateList,
    updateStatus,
    deleteList
} = require('../repositories/TodoRepository');

// Define routes
// router.get('/list', getAllLists); 
router.get('/:userId', getListByUser);
router.post('/create', createList);
router.put('/update/:id', updateList);
// router.put('/status/:id', updateStatus); 
router.delete('/delete/:id', deleteList);

module.exports = router;