const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define the schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique
    }
});

// Add Passport-Local Mongoose plugin for username and password handling
userSchema.plugin(passportLocalMongoose);

// Create and export the model
module.exports = mongoose.model('User', userSchema);
