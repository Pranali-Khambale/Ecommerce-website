const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to create a listing!");
      return res.redirect("/login");
  }
  next();  // Proceed to the next middleware or route handler
};


    module.exports.saveRedirectUrl = (req,res,next) => {
        if(req.session.redirectUrl){
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    };
    module.exports.isOwner = async (req,res,next) => {
        
        let { id } = req.params;  // Get the listing ID from params
        let listing = await Listing.findById(id);  // Correct method name to `findById`
        
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not owner of the listing");
            return res.redirect(`/listings/${id}`);
          }
          next();
    };

    module.exports.validateListing = (req, res, next) => {
      if (!req.body.listing) {
          req.flash("error", "Listing data is missing.");
          return res.redirect("/listings");
      }
      // Perform other validations on fields within req.body.listing if necessary
      next();
  };
  
  
    // Middleware for validation
    module.exports.validateReview = (req, res, next) => {
      const { error } = reviewSchema.validate(req.body);
      if (error) {
          let errMsg = error.details.map((el) => el.message).join(",");
          throw new ExpressError(400, errMsg);
      }
      next();  // Proceed to the next middleware or route handler
  };
  
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;  // Destructure the correct parameter names from the URL
  let review = await Review.findById(reviewId);  // Find the review by its ID

  // Check if the logged-in user is the author of the review
  if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);  // Redirect back to the listing page
  }
  next();  // Proceed to the next middleware or route handler if the check passes
};
