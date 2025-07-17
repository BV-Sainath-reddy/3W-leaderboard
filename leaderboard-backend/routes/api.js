const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PointHistory = require('../models/PointHistory');

// Get all users with ranking
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));
    res.json(usersWithRank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  const { name } = req.body;
  
  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Claim points for user
router.post('/users/:id/claim', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const randomPoints = Math.floor(Math.random() * 10) + 1;
    user.points += randomPoints;
    await user.save();
    
    // Create history record
    const history = new PointHistory({
      userId: user._id,
      points: randomPoints
    });
    await history.save();
    
    res.json({
      user,
      pointsAwarded: randomPoints
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get point history for a user
router.get('/users/:id/history', async (req, res) => {
  try {
    const history = await PointHistory.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
