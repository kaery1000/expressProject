var express = require("express"),
    router = express.Router(),
    YelpCamp = require("../models/campground"),
    Middleware = require("../middleware");
    

// this is the page where we show all the campgrounds
router.get("/", function(req, res) {
    YelpCamp.find({}, function(err, allCamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campGrounds : allCamps});
        }
    })
    
});

// NEW route
// this is where we can post new campgorunds
// included middleware so that onlu logged in user can create a new camp
router.post("/", Middleware.isLoggedIn, function(req, res) {
    var name = req.body.campName;
    var price = req.body.campPrice;
    var image = req.body.campImage;
    var desc = req.body.campDesc;
    var author = {
        id : req.user._id,
        username : req.user.username
    };
    var newCamp = {name : name, image : image, description : desc, author : author, price : price};
   //create a new object and save to DB
   YelpCamp.create(newCamp, 
        function(err, newCamp) {
            if (err) {
            console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
    });
});

//CREATE route
// this is a form page where we can add new campgrounds
// included middleware so that onlu logged in user can view this form
router.get("/new",Middleware.isLoggedIn , function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route
//since we are using a :id (custom), make sure we include it after the campgrounds/new, otherwise all the CREATE routes be routed to the SHOW.
//This route is used to show details about a particular campground
// here we use a populate method to get the comments associated with the id 
router.get("/:id", function(req, res) {
    YelpCamp.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
         if (err || !foundCamp) {
            req.flash("error", "Campground not found");
            res.redirect("back");
            } else {
                res.render("campgrounds/show", {campground : foundCamp});
            }
    });
});

//EDIT route
router.get("/:id/edit", Middleware.checkCampgroundOwnership, function(req, res) {
    YelpCamp.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {camp : foundCamp});
        }
    });
});

// update route
router.put("/:id", Middleware.checkCampgroundOwnership, function(req, res) {
    YelpCamp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCamp) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+foundCamp._id);
        }
    });
});


// DELETE route
router.delete("/:id", Middleware.checkCampgroundOwnership, function(req, res) {
    YelpCamp.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports  = router;