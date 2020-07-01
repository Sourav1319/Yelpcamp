var express=require("express")
var router=express.Router({mergeParams:true})
var campground=require("../models/campgrounds")
var comment=require("../models/comments")


//adding new comment
router.get("/new",isloggedin,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			console.log(campground)
			res.render("comments/new",{campground:campground});
		}
	})
	
})
router.post("/",isloggedin,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds")
		}
		else{
			comment.create(req.body.comment,function(err,newcomment){
				if(err){
					console.log(err)
				}
				else{
					
						campground.comments.push(newcomment)
						campground.save();
						res.redirect("/campgrounds/"+campground._id)
				
					
						
					}
					
				
			})
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