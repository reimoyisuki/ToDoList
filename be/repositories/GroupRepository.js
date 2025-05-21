const Group = require('../models/Group');
const User = require('../models/User');
const Todo = require('../models/Todo');

async function createGroup(req, res) {
    try {
        const { name, description, members } = req.body;
        
        const createdBy = req.user._id;
        const group = new Group({
            name,
            description,
            createdBy,
            members: [...members, createdBy],
            admins: [createdBy]
        });

        await group.save();
        
        await User.updateMany(
            { _id: { $in: group.members } },
            { $addToSet: { groups: group._id } }
        );

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: group
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function addMember(req, res) {
    try {
        const { groupId, userId, adminId } = req.body;
        
        // Check if admin is actually an admin of the group
        const group = await Group.findById(groupId);
        if (!group.admins.includes(adminId)) {
            throw new Error("Only admins can add members");
        }
        
        // Add user to group
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $addToSet: { members: userId } },
            { new: true }
        );
        
        // Add group to user's groups array
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { groups: groupId } }
        );

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            data: updatedGroup
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getGroupTodos(req, res) {
    try {
        const { groupId } = req.params;
        
        const todos = await Todo.find({ groupId })
            .sort({ severity: 1, createdAt: -1 })
            .populate('createdBy', 'username')
            .populate('lastUpdatedBy', 'username');

        res.status(200).json({
            success: true,
            message: "Successfully retrieved group todos",
            data: todos
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getUserGroups(req, res) {
    try {
        const { userId } = req.params;
        
        const groups = await Group.find({ members: userId })
            .populate('members', 'username')
            .populate('admins', 'username');

        res.status(200).json({
            success: true,
            message: "Successfully retrieved user groups",
            data: groups
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getGroupDetails(req, res) {
    try {
        const { groupId } = req.params;
        // Menggunakan user dari auth middleware
        const userId = req.user._id;

        const group = await Group.findById(groupId)
            .populate('members', 'username email')
            .populate('admins', 'username');

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        // Verify user is member of the group
        if (!group.members.some(member => member._id.equals(userId))) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }

        res.status(200).json({
            success: true,
            message: "Group details retrieved",
            data: group
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function removeMember(req, res) {
    try {
        const { groupId, memberId, adminId } = req.body;

        // Check if admin is actually an admin of the group
        const group = await Group.findById(groupId);
        if (!group.admins.includes(adminId)) {
            throw new Error("Only admins can remove members");
        }

        // Remove user from group
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $pull: { members: memberId } },
            { new: true }
        );

        // Remove group from user's groups array
        await User.findByIdAndUpdate(
            memberId,
            { $pull: { groups: groupId } }
        );

        res.status(200).json({
            success: true,
            message: "Member removed successfully",
            data: updatedGroup
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    createGroup,
    addMember,
    getGroupTodos,
    getUserGroups,
    getGroupDetails,
    removeMember
};