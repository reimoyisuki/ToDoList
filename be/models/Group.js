
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

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;