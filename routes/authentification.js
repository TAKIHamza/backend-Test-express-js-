// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const blacklistedTokens = new Set();

//middlewar
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
  
    // Check if the token is in the blacklist
   
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token ' });
      }
      req.userId = decodedToken.userId;
      next();
    });
  };
  
// Signup
router.post('/signup', async (req, res) => {
  try {
    const {name,username, password,rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name,username, password: hashedPassword,rol });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
    console.log(req.authorization)
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    blacklistedTokens.delete(req.headers.authorization);
    const token = jwt.sign({ userId: user._id ,userName: user.name}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token,user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//logout
router.post('/logout',authMiddleware, (req, res) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
  
    // Add the token to the blacklist
    blacklistedTokens.add(token);
  
    res.status(200).json({ message: 'Logout successful' });
  });

  module.exports = { router, authMiddleware, blacklistedTokens };
