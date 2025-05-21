const Todo = require('../models/Todo');
const Group = require('../models/Group');
const User = require('../models/User');

async function createList(req, res) {
    try {
        const { userId, groupId, content, severity } = req.body;
        
        // Validate if user has access to the group if it's a group todo
        if (groupId) {
            const group = await Group.findById(groupId);
            if (!group.members.includes(userId)) {
                throw new Error("User is not a member of this group");
            }
        }
        
        const todo = new Todo({ 
            userId: groupId ? null : userId,
            groupId: groupId || null,
            content, 
            severity,
            createdBy: userId
        });
        
        await todo.save();

        // Add to user's todos if it's a personal todo
        if (!groupId) {
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { todos: todo._id } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Successfully Created Todo",
            data: todo
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getListByUser(req, res) {
    try {
        const { userId } = req.params;
        const todos = await Todo.find({ userId })
            .sort({ severity: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Successfully retrieved user's todos",
            data: todos
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function updateList(req, res) {
    try {
        const { id } = req.params;
        const { content, severity, status, userId } = req.body;

        const todo = await Todo.findById(id);
        if (!todo) throw new Error("Todo not found");

        // Check permissions
        if (todo.groupId) {
            const group = await Group.findById(todo.groupId);
            if (!group.members.includes(userId)) {
                throw new Error("User is not authorized to edit this todo");
            }
        } else if (todo.userId.toString() !== userId) {
            throw new Error("User is not authorized to edit this todo");
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { 
                content, 
                severity, 
                status,
                lastUpdatedBy: userId 
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            data: updatedTodo
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function deleteList(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const todo = await Todo.findById(id);
        if (!todo) throw new Error("Todo not found");

        // Check permissions
        if (todo.groupId) {
            const group = await Group.findById(todo.groupId);
            if (!group.admins.includes(userId) && todo.createdBy.toString() !== userId) {
                throw new Error("User is not authorized to delete this todo");
            }
        } else if (todo.userId.toString() !== userId) {
            throw new Error("User is not authorized to delete this todo");
        }

        await Todo.findByIdAndDelete(id);
        
        // Remove from user's todos if it's a personal todo
        if (!todo.groupId) {
            await User.findByIdAndUpdate(
                userId,
                { $pull: { todos: id } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

module.exports = {
    createList,
    getListByUser,
    updateList,
    deleteList
};