var mongoose = require("mongoose");

//mongoDb schema
var yelpCampSchema = new mongoose.Schema({
    name : String,
    price : String,
    image : String,
    description : String,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    author : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String   //this is added so that we dont have to query using the ID all the time
    }
});

// mongo model
module.exports = mongoose.model("YelpCamp", yelpCampSchema);