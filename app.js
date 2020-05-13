var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    Campground = require("./models/campground"),
    seedDB = require("./seeds");

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology:true, useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});
// INDEX - showo all campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            console.log(allCampgrounds);
            res.render("index", {campgrounds: allCampgrounds});
        }

    });
});

// CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    let name = req.body.name;
    let img = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: img, description: desc}

    Campground.create(newCampground, function(err, newCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    })
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
    res.render("new");
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    console.log(req.params);
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("show", {campground:foundCampground});
        }
    });
});

app.get("*", function(req, res){
    res.send("PAGE NOT FOUND :(");
});

app.listen(3000, function(){
    console.log("Server is running...");
});