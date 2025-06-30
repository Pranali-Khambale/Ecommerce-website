if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
require("dotenv").config();

// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",() => {
  console.log("ERROR IN MONGO SESSION STORE",err);
});


const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7* 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Set view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user ||null;
  next();
});

// app.get("/demouser",async (req,res) => {
//   let fakeUser = new User({
//     email:"abc@gmail.com",
//     username:"delta-student",
//   });
//   let registeredUser =await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });



// Listings and Reviews Routes
app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
 


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// // Error handling route
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// Centralized error handler
// Catches and displays errors
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

// Start server
// Runs the server on port 8080
app.listen(8080, () => console.log("Server is listening on port 8080"));
