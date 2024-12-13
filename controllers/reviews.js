const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id); // Corrected: Use req.params.id
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review Created!");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => { // Corrected path to include :reviewId
    const { id, reviewId } = req.params;

    // Pull the review from the listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete the review from the Review model
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};