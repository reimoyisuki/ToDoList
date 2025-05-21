require("dotenv").config();
const userRoutes = require('./routes/UserRoutes');
const todoRoutes = require('./routes/TodoRoutes');
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const groupRoutes = require('./routes/GroupRoutes');
const messageRoutes = require('./routes/MessageRoutes')

const port = process.env.PORT;
const app = express();

// connect to database
db.connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5175'],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.get('/status', (req, res) => {
    res.status(200).send({ status: "Server is running" });
});

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);
app.use("/group", groupRoutes);
app.use("/message", messageRoutes);

app.listen(port, () => {
    console.log(`🚀 Server is running on PORT ${port}`);
});