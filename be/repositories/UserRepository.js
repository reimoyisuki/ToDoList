const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username or email already in use",
            });
        }
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "secretsecret",
            { expiresIn: "2h" }
        );

        res.status(201).json({
            success: true,
            message: "Successfully Registered User",
            token,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function login(req, res) {
    try {
        const { email, username, password } = req.body;
        
        // Mencari user berdasarkan email atau username
        const user = await User.findOne({
            $or: [
                { email: email || '' },
                { username: username || '' }
            ]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        console.log("Credentials valid, generating token...");
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "secretsecret",
            { expiresIn: "2h" }
        );
        
        console.log("Generated token:", token);
        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Token generation failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token, 
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(400).json({ 
            success: false, 
            message: err.message || "An error occurred during login" 
        });
    }
}

async function getUser(req, res) {
    try {
        const user = req.user;
        res.json({
            success: true,
            data: {
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
}

async function changeName(req, res) {
    try {
        const { id } = req.params;
        const { newUsername } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { username: newUsername },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        res.status(200).json({
            success: true,
            message: "Username updated successfully",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find()
            .select('-password')  // Exclude password from results
            .sort({ updatedAt: -1 });
            
        res.status(200).json({
            success: true,
            message: "Successfully retrieved all users",
            data: users
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

async function deleteAccount(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if (!user) throw new Error("User not found");

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

module.exports = {
    register,
    login,
    getUser,
    changeName,
    deleteAccount,
    getAllUsers
};