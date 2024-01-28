const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const bodyParser = require('body-parser');
const {establishDBconnection,createNewRecord} = require('./seeds/index')

establishDBconnection();
// createNewRecord();


const cors = require("cors");
// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// respond with "hello world" when a GET request is made to the homepage
app.get("/getRecords", async (req, res) => {
    // Handle your API logic here
    try {
        // 3. Use Mongoose to fetch all records
        const allRecords = await Campground.find({});
        // 4. Send the records to the React frontend
        res.json(allRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.get("/getOneRecord/:id", async (req, res) => {
  // Handle your API logic here
  const recordId = req.params.id;
  try {
    // Use Mongoose to fetch a single record by ID
    const singleRecord = await Campground.findById(recordId);
    if (!singleRecord) {
      // If the record is not found, return a 404 status
      return res.status(404).json({ error: 'Record not found' });
    }
    // Send the single record to the React frontend
    res.json(singleRecord);
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createCampground', async(req,res)=>{
  try {
    // Extract data from the request body
    const { title, location, price, description,image } = req.body;

    // Create a new record
    // const newRecord = new Record({title:title, location:location, price:price, description });
    const newRecord = new Campground(req.body);
    console.log(newRecord)
    // Save the record to the database
    await newRecord.save();

    // Send a response
    res.status(201).json({ message: 'Record created successfully'});
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.put('/editCampground/', async (req, res) => {
  try {
    // Extract data from the request body
    const { id, title, location, price, description, image } = req.body;
    // Find the existing record in the database
    const existingRecord = await Campground.findById(id);
    if (!existingRecord) {
      return res.status(404).json({ error: 'Campground not found' });
    }
    // Update the existing record with the new data
    existingRecord.title = title;
    existingRecord.location = location;
    existingRecord.price = price;
    existingRecord.description = description;
    existingRecord.image = image;

    // Save the updated record to the database
    await existingRecord.save();

    // Send a response
    res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteCampground/', async (req, res) => {
  try {
    // Extract the campground ID from the request parameters
    const {id} = req.body;

    // Find the existing record in the database
    const existingRecord = await Campground.findById(id);

    if (!existingRecord) {
      return res.status(404).json({ error: 'Campground not found' });
    }

    // Remove the record from the database
    await existingRecord.deleteOne({id:id}).then(function(){
      console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });;

    // Send a response
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});