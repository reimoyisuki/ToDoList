
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: function(v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: props => `${props.value} is not a valid user ID!`
            }
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        chatEnabled: [{
            type: Boolean,
            default: true
        }]
    }, { timestamps: true }
);

groupSchema.methods.getActiveMembers = async function() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return User.aggregate([
        { $match: { _id: { $in: this.members } } },
        {
            $project: {
                username: 1,
                email: 1,
                isActive: { $gte: ["$lastActive", fiveMinutesAgo] },
                lastActive: 1
            }
        },
        { $sort: { isActive: -1, username: 1 } }
    ]);
};

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;