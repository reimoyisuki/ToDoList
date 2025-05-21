const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        },
        content: {
            type: String,
            required: true
        },
        severity: {
            type: Number,
            required: true,
            enum: [1, 2, 3],
            default: 2
        },
        status: {
            type: String,
            enum: ['todo', 'ongoing', 'finished'],
            default: 'todo'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true }
);

todoSchema.index({ userId: 1, groupId: 1, severity: 1, status: 1 });

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;