const express = require('express');
const router = express.Router();
const SongPost = require('../models/SongPost'); 

// Route to get all song posts
router.get('/songposts', async (req, res) => {
  try {
    const songPosts = await SongPost.find({});
    res.status(200).json(songPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/songposts/:id', async (req, res) => {
  try {
    const songPost = await SongPost.findById(req.params.id);
    if (!songPost) {
      return res.status(404).json({ message: 'Song post not found' });
    }
    res.status(200).json(songPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new song post
router.post('/songposts', async (req, res) => {
  try {
    // Extract song details and other song post information from the request body
    const { songDetails, username, description, location } = req.body;

    // Create and save the new song post
    const newSongPost = new SongPost({
      username: username || 'Anonymous', // Use 'Anonymous' if no username is provided
      song: songDetails, // Use the extracted song details
      description,
      location
    });

    const savedSongPost = await newSongPost.save();
    res.status(201).json(savedSongPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to like a song post
router.post('/songposts/:id/like', async (req, res) => {
  try {
    const songPost = await SongPost.findById(req.params.id);
    songPost.likes += 1;
    await songPost.save();
    res.status(200).json(songPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a comment to a song post
router.post('/songposts/:id/comments', async (req, res) => {
  try {
    const songPost = await SongPost.findById(req.params.id);
    const newComment = {
      username: req.body.username || 'Anonymous',
      text: req.body.text
    };
    songPost.comments.push(newComment);
    await songPost.save();
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
