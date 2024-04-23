const mongoose = require('mongoose');

const SongPostSchema = new mongoose.Schema({
  username: { type: String, default: 'Anonymous' }, // User-provided name/alias
  song_id: { type: String, required: true },
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

const SongPost = mongoose.model('SongPostBackend', SongPostSchema);

module.exports = SongPost;