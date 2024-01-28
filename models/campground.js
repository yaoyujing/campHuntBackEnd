const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
    title:String,
    location:String,
    price:String,
    description:String,
    imageUrl:String,
})

module.exports = mongoose.model('Campground',CampGroundSchema)