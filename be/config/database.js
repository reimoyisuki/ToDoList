const mongoose = require("mongoose");
require('dotenv').config();

exports.connectDB = async function () {
    try {
        const URI = process.env.MONGODB_URI;
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        mongoose.set("strictQuery", false);
        mongoose.set("strictPopulate", false);

        await mongoose.connect(URI, connectionParams);
        console.info("MongoDB Connection established");
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};