const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Extract Schema from mongoose
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{
      type: {
        type: String,
        enum: ['Point'], // Don't do `{ location: { type: String } }`
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  // category:{
  //   type:String,
  //   enum:["mountains","arctic",""]
  // }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
