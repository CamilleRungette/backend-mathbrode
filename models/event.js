const mongoose = require('./db');

let eventSchema = mongoose.Schema({
    name: String,
    address: String,
    zip_code: String,
    city: String,
    date: Date,
    photo: String,
    starting_time: String,
    ending_time: String,
    link: String,
});

const EventModel = mongoose.model("events", eventSchema);

module.exports = EventModel;