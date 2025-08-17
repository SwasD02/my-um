const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    venue:{
        type: String,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    endTime:{
        type: String,
        required: true
    },
    coordLat : {
        type: Number,
        required: false
    },
    coordLong : {
        type: Number,
        required: false
    },
    notes: {
        type: String, 
        required: false
    }
})

const userActSchema = new Schema({
    date: {type: String, required: true},
    events: [eventsSchema]

}, {
    timestamps: true
});

module.exports = userActSchema;