var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology:true, useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"}, function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     }
// );

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }

    });
});

app.post("/campgrounds", function(req, res){
    let name = req.body.name;
    let img = req.body.image;
    let newCampground = {name: name, image: img}

    Campground.create(newCampground, function(err, newCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
})

app.get("*", function(req, res){
    res.send("PAGE NOT FOUND :(");
});

app.listen(3000, function(){
    console.log("Server is running...");
});