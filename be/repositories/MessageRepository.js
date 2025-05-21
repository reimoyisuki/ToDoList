const Message = require('../models/Message');
const Group = require('../models/Group');

exports.sendGroupMessage = async (req, res) => {
    try {
        const { message, groupId } = req.body;
        const senderId = req.user._id;

        if (!message || !groupId) {
            return res.status(400).json({ 
                error: "Message content and groupId are required." 
            });
        }
        // Verify user is group member
        const group = await Group.findById(groupId);
        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ error: 'Not a group member' });
        }
        if (!message || !groupId || !senderId) {
            return res.status(400).json({ 
                error: "Message, groupId, and senderId are required." 
            });
        }

        const newMessage = new Message({
            content:message,
            sender: senderId,
            groupId: groupId,
            readBy: [senderId]
        });

        await newMessage.save();

        res.status(201).json(newMessage);
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

        const messages = await Message.find({ groupId: groupId })
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