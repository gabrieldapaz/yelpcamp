var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://media-cdn.tripadvisor.com/media/photo-o/13/b8/8a/28/olakira-camp-asilia-africa.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac ipsum porttitor, dignissim libero sit amet, tempus quam. Integer velit tellus, porttitor in bibendum vitae, porta sit amet velit. In et aliquet orci, quis pulvinar libero. Mauris lacinia eget sem sit amet egestas. Mauris at ante non nunc consectetur finibus. Maecenas aliquam justo non lacus venenatis, eu euismod felis pellentesque."
    },
    {
        name: "Desert Mesa",
        image: "https://q-xx.bstatic.com/xdata/images/hotel/840x460/196377895.jpg?k=50abd15a8d47232fc79dddebe6b56249e2abd55844165a5e0d47cb4b1d3ab925&o=",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac ipsum porttitor, dignissim libero sit amet, tempus quam. Integer velit tellus, porttitor in bibendum vitae, porta sit amet velit. In et aliquet orci, quis pulvinar libero. Mauris lacinia eget sem sit amet egestas. Mauris at ante non nunc consectetur finibus. Maecenas aliquam justo non lacus venenatis, eu euismod felis pellentesque."
    },
    {
        name: "Canyon Floor",
        image: "https://i.zst.com.br/images/8-melhores-barracas-de-camping-em-2018-voce-compra-aqui-photo240843911-44-1b-17.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac ipsum porttitor, dignissim libero sit amet, tempus quam. Integer velit tellus, porttitor in bibendum vitae, porta sit amet velit. In et aliquet orci, quis pulvinar libero. Mauris lacinia eget sem sit amet egestas. Mauris at ante non nunc consectetur finibus. Maecenas aliquam justo non lacus venenatis, eu euismod felis pellentesque."
    }
];

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("added a campground");
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                            
                        });
                }
            });
        });
    });

};

module.exports = seedDB;