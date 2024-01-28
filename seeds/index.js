const mongoose = require("mongoose");
const Campground = require("../models/campground");
const {descriptors,places} = require("./cityHelper")
const cities = require('./cities');

module.exports.establishDBconnection = async () => {
  const url = "mongodb://localhost:27017/camp-hunt"
  try {
    await mongoose.connect(url);
    console.log("1")
  } catch (error) {
    console.log(error);
  }
  const dbConnection = mongoose.connection;
  if (dbConnection.readyState === 1) {
    // The connection is already open
    console.log(`Database connected: ${url}`);
  } else {
    // The connection is not yet open, listen for the open event
    dbConnection.once('open', () => {
      console.log(`Database connected: ${url}`);
    });
  }
  return;
};

const sample = (array) => array[Math.floor(Math.random()*array.length)];

module.exports.createNewRecord = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<5;i++){
        const randomNum = Math.floor(Math.random()*cities.length-1);
        const camps = new Campground({
            location:`${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            price: Math.floor(Math.random() * 1000) + 500,
            imageUrl: `img${i+1}`
        })
        await camps.save()
    }
}

// establishDBconnection();

