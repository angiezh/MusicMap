const mongoose = require('mongoose');

const SongPostSchema = new mongoose.Schema({
  username: { type: String, default: 'Anonymous' }, // User-provided name/alias
  song: { // Subdocument for song details
    id: String, // Spotify song ID
    name: String, // Name of the song
    artist: String, // Artist of the song
    album: String, // Album name
    preview_url: String, // URL for the song preview
    image_url: String // URL for the album image
  },
  description: String, // Description or story about the song
  location: { // Geographic coordinates for the song note
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  likes: { type: Number, default: 0 }, // Count of likes for the song note
  comments: [{ // Array of comments made on the song note
    username: { type: String, default: 'Anonymous' }, // User-provided name/alias for the comment
    text: { type: String, required: true }, // Content of the comment
    createdAt: { type: Date, default: Date.now } // Timestamp when the comment was made
  }],
  reportedAt: { type: Date, default: Date.now } // Timestamp when the song note was created
});

SongPostSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const SongPost = mongoose.model('SongPost', SongPostSchema);

module.exports = SongPost;