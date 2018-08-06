var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    YelpCamp = require("./models/campground"),
    Comment = require("./models/comments"),
    flash       = require("connect-flash"),
    seedDB = require("./seed"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    mongoose = require("mongoose");
    

// importing all the routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //dirname is just another wy to be expressive, just "public" could have been fine
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(flash());

//Mongo connect
// mongoose.connect('mongodb://localhost:27017/yelpcampFinal')
// mongoose.connect('mongodb://kaery1000:rama1729@ds115022.mlab.com:15022/yelpcamp', { useNewUrlParser: true });
// If DB not accessible via env vars, then assign a default stage DB 
var dbUrl = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcampFinal";
mongoose.connect(dbUrl, {useNewUrlParser : true});
// seed the DB
//seedDB();

// configuring passport authentication
app.use(require("express-session") ({
    secret: "my name is mehta",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));    //this means we using a stratey that comes with the passport-local-mongoose. Otherwise we have to write ourself
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// adding user data to all the routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// using the routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);



/*======Listen to Port*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started");
}); 