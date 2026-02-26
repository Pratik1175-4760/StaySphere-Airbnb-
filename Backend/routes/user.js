const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.js');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }
    
    // Create new user (password will be hashed automatically)
    const user = new User({ username, email, password });
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });
    
    res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Error creating account' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    res.json({
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.json({ user: null });
    }
    
    const verified = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(verified.userId).select('-password');
    
    if (!user) {
      return res.json({ user: null });
    }
    
    res.json({ user });
    
  } catch (err) {
    res.json({ user: null });
  }
});

module.exports = router;