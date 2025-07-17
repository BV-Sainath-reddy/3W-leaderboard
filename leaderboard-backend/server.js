const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api', apiRoutes);

// Initialize with 10 default users if empty
async function initializeUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    const defaultUsers = [
      'Rahul', 'Kamal', 'Sanak', 'Priya', 'Amit',
      'Neha', 'Vikram', 'Sonia', 'Raj', 'Anjali'
    ];
    await User.insertMany(defaultUsers.map(name => ({ name })));
    console.log('Default users created');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeUsers();
});
