const express = require('express');
const router = express.Router();
const Pantries = require('../models/Pantries');
const Counter = require('../models/Counter');

// POST route to create a new pantry
router.post('/', async (req, res) => {
    try {
        const { name, ownerId } = req.body //extract name and description from request body

        //check if provided
        if (!name || !ownerId) {
            return res.status(400).json({error: 'Name of pantry and ownerId are required.'});
        }

        //generate unique pantryId
        const pantryId = await generateUniquePantryId();

        const pantry = new Pantries({
            pantryId: pantryId,
            name: name,
            ownerId: ownerId,
        });

        //save pantry to db
        const savedPantry = await pantry.save();

        // send saved pantry as response
        res.status(201).json(savedPantry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error creating a new pantry' });
    }
});

// GET route to retrieve a pantry by pantryId => 
//      this would be used for all interaction for getting information from pantries.
//      Ex: want to display all ingredients in a pantry? GET by pantryId and sort through ingredients array.
//      "but thor how do we get the pantryIds???" they should be in a nice array in the user route
router.get('/:pantryId', async (req, res) => {
    try {
        const { pantryId } = req.params;
        
        //find pantry by pantryId
        const pantry = await Pantries.findOne({ pantryId });

        //check if exists
        if (!pantry) {
            return res.status(404).json({ error: 'Pantry not found.'});
        }

        //send pantry as object as response
        res.json(pantry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error fetching from pantry' });
    }
});
// DELETE route to delete pantry by pantryId

// PUT route to add ingredient(s) to a pantry
// DELETE route to delete ingredient(s) from a pantry

// PUT route to add collaborator(s) to a pantry
// DELETE route to delete collaborator(s) from a pantry



//default
router.post('/', async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Function to generate a unique badgeId (thanks Mike)
async function generateUniquePantryId() {
    try {
        // Find and increment the counter for badges
        const counter = await Counter.findOneAndUpdate(
            { name: 'pantryIdCounter' },
            { $inc: { countVal: 1 } }, // Increment the counter value by 1
            { new: true, upsert: true } // Return the updated counter, create if not exists
        );
        return counter.countVal.toString(); // Use the value as the unique ID for the badge object
    } catch (error) {
        console.error('Error generating a unique pantry ID:', error);
        throw error;
    }
}

/**
 * Question: do we ever need to change the pantry, name, or ownerId of the pantry? no I don't think we let them change name of pantry
 */