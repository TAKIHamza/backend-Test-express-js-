// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



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

  module.exports = { router, authMiddleware };
