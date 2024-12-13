const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(), // Pass Date.now as a function reference
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);
