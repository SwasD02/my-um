const mongoose = require('mongoose');
const userActSchema = require('./userAct');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    days: [userActSchema]

    }
);

module.exports = mongoose.model('UserData', userSchema);



