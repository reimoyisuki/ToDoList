const Message = require('../models/Message');

exports.sendGroupMessage = async (req, res) => {
    try {
        const { content, groupId } = req.body;
        
        // Verify user is group member
        const group = await Group.findById(groupId);
        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ error: 'Not a group member' });
        }

        const message = new Message({
            content,
            sender: req.user._id,
            group: groupId,
            readBy: [req.user._id]
        });

        await message.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        // Verify user is group member
        const group = await Group.findById(groupId);
        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ error: 'Not a group member' });
        }

        const messages = await Message.find({ group: groupId })
            .sort('-createdAt')
            .limit(50)
            .populate('sender', 'username');

        res.json(messages.reverse());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// module.exports = {
//     sendGroupMessage,
//     getGroupMessages
//     // markAsRead
// }