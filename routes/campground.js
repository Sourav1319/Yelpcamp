var express=require("express")
var router=express.Router()
var campground=require("../models/campgrounds")


//looping through and displaying the campgrounds
router.get("/",function(req,res){
	campground.find({},function(err,campground){
		if(err){
			console.log("error")
		}
		else{
			console.log("server said chill")
			res.render("campgrounds/index",{campgrounds:campground})
		}
	});

})
router.post("/",isloggedin,function(req,res){
	
	campground.create(req.body.newcampground,function(err,campground){
		if(err){
			console.log("error")
		}
		else{
			console.log("chill")
			console.log(campground)
		}
	});
	res.redirect("/")
})

//adding new campgrounds
router.get("/new",isloggedin,function(req,res){
	res.render("campgrounds/new");
})
router.get("/:id",function(req,res){
	//get the elements by id
	//past it to show.ejs
	campground.findById(req.params.id).populate("comments").exec(function(err,showcampground){
		if(err){
			console.log(err)
			console.log("error")
		}
		else{
			console.log(showcampground)
			res.render("campgrounds/shows",{campground:showcampground});
		}
	})

})

//middleware
function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

module.exports=router;