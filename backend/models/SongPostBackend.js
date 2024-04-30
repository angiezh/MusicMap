const mongoose = require("mongoose");

const SongPostSchema = new mongoose.Schema({
  username: { type: String, default: "Anonymous" }, // User-provided name/alias
  song_id: { type: String, required: true }, // Spotify song ID
  description: String, // Description or story about the song
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers for Longitude (first) and Latitude (second)
      required: true,
    },
  },
  likes: { type: Number, default: 0 }, // Count of likes for the song note
  comments: { type: [{ username: String, text: String, createdAt: Date }], default: [] },
  reportedAt: { type: Date, default: Date.now }, // Timestamp when the song note was created
});

// Index to improve queries using the geospatial data
SongPostSchema.index({ location: "2dsphere" });

const SongPost = mongoose.model("SongPost", SongPostSchema);

module.exports = SongPost;
