var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology:true, useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


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
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
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
    res.render("campgrounds/new");
})

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

// ===================
// COMMENTS ROUTES
// ===================

app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("Erro creating the comment");
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// ==========
// AUTH ROUTES
// ==========

// SING UP
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });

});

// LOGIN
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res){

});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.get("*", function(req, res){
    res.send("PAGE NOT FOUND :(");
});

app.listen(3000, function(){
    console.log("Server is running...");
});