const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        password: {
            type: String,
            required: true,
        },
        todos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo",
        }],
        groups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        }],
        lastActive: {
            type: Date,
            default: Date.now
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        socketId: {
            type: String,
            default: null
        }
    }, { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.updateActivity = function() {
    this.lastActive = Date.now();
    return this.save();
};

userSchema.methods.checkIfActive = function() {
    // Anggap user aktif jika terakhir aktif dalam 5 menit terakhir
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastActive >= fiveMinutesAgo;
};

userSchema.virtual('activeStatus').get(function() {
    return this.checkIfActive() ? 'online' : 'offline';
});

userSchema.statics.getActiveUsersStats = async function() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return this.aggregate([
        {
            $facet: {
                totalUsers: [{ $count: "count" }],
                activeUsers: [
                    { $match: { lastActive: { $gte: fiveMinutesAgo } } },
                    { $count: "count" }
                ],
                byLastActivity: [
                    {
                        $bucket: {
                            groupBy: "$lastActive",
                            boundaries: [
                                new Date(Date.now() - 24 * 60 * 60 * 1000),
                                new Date(Date.now() - 60 * 60 * 1000),
                                new Date(Date.now() - 30 * 60 * 1000),
                                new Date(Date.now() - 5 * 60 * 1000),
                                new Date(Date.now())
                            ],
                            default: "older",
                            output: {
                                count: { $sum: 1 }
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                total: { $arrayElemAt: ["$totalUsers.count", 0] },
                active: { $arrayElemAt: ["$activeUsers.count", 0] },
                activityDistribution: "$byLastActivity"
            }
        }
    ]);
};

const User = mongoose.model("User", userSchema);

module.exports = User;