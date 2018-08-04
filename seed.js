var mongoose = require("mongoose"),
    campgrounds = require("./models/campground"),
    comments = require("./models/comments");
    

var data = [
    {
        name : "Forest hills",
        image : "https://images.pexels.com/photos/730426/pexels-photo-730426.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "A newly added campgorund"
    },
    {
        name : "Forest hills",
        image : "https://images.pexels.com/photos/723585/pexels-photo-723585.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "A newly added campgorund"
    },
    {
        name : "Forest hills",
        image : "https://images.pexels.com/photos/290448/pexels-photo-290448.jpeg?auto=compress&cs=tinysrgb&h=350",
        description : "A newly added campgorund"
    }];
    
function seedDB() {
    campgrounds.remove({}, function(err) {
         if (err) {
             console.log(err) ;
         } 
        // console.log("campgrounds removed");
        // // add new campgrounds
        // data.forEach(function(seed) {
        //     campgrounds.create(seed, function(err, camp) {
        //         if(err) {
        //             console.log(err);
        //         } else{
        //             console.log("campground created");
        //             comments.create(
        //                 {
        //                     text :"Hello this is my comment" ,
        //                     author : "Karan"
        //                 }, function(err, comment) {
        //                     if(err) {console.log(err)}
        //                     camp.comments.push(comment);
        //                     camp.save();
        //                     console.log("comment added");
        //                 }
        //             )
        //         }
        //     });
        // });
    });
}

module.exports = seedDB;