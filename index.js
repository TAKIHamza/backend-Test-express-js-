// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const commandRoute =require('./routes/commandRoute')
const productRoutes = require('./routes/productRoute');
const { router, authMiddleware, blacklistedTokens } = require('./routes/authentification');
const cors = require('cors');

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
app.use('/auth', router);
app.use('/product', productRoutes);
app.use('/command', commandRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
