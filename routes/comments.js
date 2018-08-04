var express = require("express"),
    router = express.Router({mergeParams : true}), //merges the paranms from campground so that the id is visible
    YelpCamp = require("../models/campground"),
    Comment = require("../models/comments"),
    Middleware = require("../middleware");
    
// =====Comment Routes=======

router.get("/new", Middleware.isLoggedIn ,function(req, res) {
    YelpCamp.findById(req.params.id, function(err, camp) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {camp : camp});
        }
    });
});

router.post("/", Middleware.isLoggedIn ,function(req, res) {
    YelpCamp.findById(req.params.id, function(err, camp) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //Added to save the logged in user to the database and on the comment form
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + camp._id);
                }
                
            });
        }
    });
});



// EDIT route
router.get("/:comment_id/edit", Middleware.checkCommentOwnership, function(req, res) {
    YelpCamp.findById(req.params.id, function(err, foundCamp) {
        if(err || !foundCamp) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, comment) {
            if(err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id : req.params.id, comment : comment});
            }
        });
    });
});


// UPDATE route
router.put("/:comment_id", Middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE route
router.delete("/:comment_id", Middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id ,function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ==================


module.exports = router;


