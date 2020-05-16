var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// INDEX - showo all campgrounds
router.get("/", function(req, res){
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            console.log(allCampgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }

    });
});

// CREATE - add new campground to DB
router.post("/", function(req, res){
    let name = req.body.name;
    let img = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: img, description: desc, author:author}

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
router.get("/new", isLoggedIn ,function(req, res){
    res.render("campgrounds/new");
})

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    console.log(req.params);
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;