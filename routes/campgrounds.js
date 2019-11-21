var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


// =====================
// Campgrounds Routes
// =====================

// Index Route - Show All Campgrounds
router.get("/", function(req, res) {
	Campground.find({}, function(err, allcampgrounds) {
		if(err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index", {campgrounds : allcampgrounds});
		}
	});
});

// Create Route - Add New Camogrounds To Database
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name : name, price: price, image : image, description : description, author: author};
	Campground.create(newCampground, function(err, newlycreated) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(newlycreated);
			res.redirect("/campgrounds");
		}
	});
});



// New Route - Show Form to Create New Camoground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});



// Show Route - Shows more info about a particular campground
router.get("/:id", function(req, res) {
	// find the campground with provided ID	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground : foundCampground});
		}
	});
});



// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});



// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});





module.exports = router;