require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const initializeDatabase = require('./routes/initializeDatabase'); // Assuming this script exists and exports a function

const songPostRoutes = require('./routes/songRoutes'); // Ensure the file name matches your routes file for song posts

const app = express();
const PORT = process.env.PORT || 8800; // You can keep the same port or change it as needed

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB connected");
    initializeDatabase(); // Call the initialization function here after a successful connection
})
.catch((err) => console.error("MongoDB connection error:", err));

// Use the song post routes for handling requests related to song posts
app.use('/api/songposts', songPostRoutes);

// Basic error handler to catch any routing errors
app.use((err, req, res, next) => {
    console.error("Express error:", err.stack); // Log the error stack for debugging
    res.status(500).send({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
