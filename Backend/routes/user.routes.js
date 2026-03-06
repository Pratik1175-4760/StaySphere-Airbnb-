const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller.js')


// Signup Route
router.post('/signup',User.signUp);

// Login Route
router.post('/login', User.Login);

// Logout Route
router.post('/logout', User.Logout );

// Get Current User
router.get('/me', User.Me);

module.exports = router;