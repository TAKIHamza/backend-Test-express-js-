// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const commandRoute =require('./routes/commandRoute')
const productRoutes = require('./routes/productRoute');
const { router, authMiddleware, blacklistedTokens } = require('./routes/authentification');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use('/images', express.static('images'));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

app.use('/product', productRoutes);
app.use('/command', commandRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
