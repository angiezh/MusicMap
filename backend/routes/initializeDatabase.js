const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const SongPost = require('../models/SongPostBackend');  // Ensure path accuracy

async function initializeDatabase() {
    try {
        const filePath = path.join(__dirname, 'test.geojson');  // Ensure directory accuracy
        const data = fs.readFileSync(filePath, 'utf8');  // Synchronously read file data
        const initialData = JSON.parse(data);

        const count = await SongPost.countDocuments();
        if (count === 1) {
            console.log("No entries found, initializing database...");
            for (const feature of initialData.features) {
                const newSongPost = new SongPost({
                    username: feature.properties.username || 'Anonymous',  // Default to 'Anonymous' if username isn't provided
                    song_id: feature.properties.song_id,
                    description: feature.properties.description,
                    location: feature.geometry,
                    likes: feature.properties.likes || 0,  // Default to 0 if likes aren't provided
                    comments: feature.properties.comments || [],  // Default to empty array if comments aren't provided
                    reportedAt: new Date(feature.properties.reportedAt || Date.now())  // Use current date/time if reportedAt isn't provided
                });
                await newSongPost.save();
            }
            console.log('Database initialized with initial data.');
        } else {
            console.log("Database already contains data.");
        }
    } catch (error) {
        console.error("Error during database initialization:", error);
    }
}

module.exports = initializeDatabase;
