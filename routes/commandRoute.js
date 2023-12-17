const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./authentification');
const Command = require('../models/command');
const CommandProduct = require("../models/commandProduct")

const jwt = require('jsonwebtoken');
// Route to get all commands
router.get('/commands', async (req, res) => {
    try {
        const token = req.headers.authorization;
        // Extract data from the request

     
        const  decodedToken= jwt.verify(token, process.env.JWT_SECRET);
       const clientId =decodedToken.userId
        
    
        // Find commands for the specified clientId
        const commands = await Command.find({ clientId });
    
        // Create an array to store the result
        const result = [];
    
        // Iterate over each command and retrieve associated product commands
        for (const command of commands) {
          const commandId = command._id;
    
          // Find product commands for the current commandId
          const product = await CommandProduct.find({ commandId });
          const {_id,clientId,numberOfProducts,totalPrice,date}=command
          // Push the result to the array
          result.push({
            _id,clientId,numberOfProducts,totalPrice,date,
            product,
          });
        }
    
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

// Route to create a new command
router.post('/commands', async (req, res) => {

    try {
        const token = req.headers.authorization;
        // Extract data from the request
console.log(token)
console.log(req.body)
         let { clientId, numberOfProducts, totalPrice,date, product } = req.body;

     const  decodedToken= jwt.verify(token, process.env.JWT_SECRET);
         clientId =decodedToken.userId
        //  Create a new Command document
        const command = new Command({
          clientId,
          numberOfProducts,
          totalPrice,
          date,
        });
    
        // Save the Command document to the database
        const savedCommand = await command.save();
    
        // Extract the commandId from the saved Command document
        const commandId = savedCommand._id;
    
        // Iterate over each product in the request and create a CommandProduct document for each
        for (const productData of product) {
            
          const { image, price, productId, productName, quantity } = productData;
          if(quantity>1){
          // Create a new CommandProduct document
          const commandProduct = new CommandProduct({
            commandId,
            productId,
            productName,
            image,
            price,
            quantity,
          });
    
          // Save the CommandProduct document to the database
          await commandProduct.save();}
        }
    
        res.status(200).json({ message: 'Command saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

// Route to update a command by ID


module.exports = router;
