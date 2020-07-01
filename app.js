var express 			 =require("express"),
	mongoose             =require("mongoose"),
	bodyparser 			 =require("body-parser"),
	seedDB 				 =require("./seeds"),
	campground 			 =require("./models/campgrounds"),
	comment 			 =require("./models/comments.js"),
	passport 			 =require("passport"),
	passportlocal        =require("passport-local"),
	passportlocalmongoose=require("passport-local-mongoose"),
	session              =require("express-session"),
	User 				 =require("./models/user")
	app 				 =express()



seedDB();

mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true})
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"));

//passing info of the user to all the routes available


//adding the auth packages

app.use(session({
	secret:"sourav",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})	

app.get("/",function(req,res){
	res.render("home")
})

app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",isloggedin,function(req,res){
	
	campground.create(req.body.newcampground,function(err,campground){
		if(err){
			console.log("error")
		}
		else{
			console.log("chill")
			console.log(campground)
		}
	});
	res.redirect("/campgrounds")
})
app.get("/campgrounds/new",isloggedin,function(req,res){
	res.render("campgrounds/new");
})
app.get("/campgrounds/:id",function(req,res){
	//get the elements by id
	//past it to show.ejs
	campground.findById(req.params.id).populate("comments").exec(function(err,showcampground){
		if(err){
			console.log("errorgrrrrrrrrrrregeg")
		}
		else{
			console.log(showcampground)
			res.render("campgrounds/shows",{campground:showcampground});
		}
	})

})
// =================================
// COMMENTS 
// =================================

app.get("/campgrounds/:id/comments/new",isloggedin,function(req,res){
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
app.post("/campgrounds/:id/comments",isloggedin,function(req,res){
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
//AUTH routes

app.get("/register",function(req,res){
	res.render("register")
})
app.post("/register",function(req,res)
		{
			User.register(new User({username:req.body.username}),req.body.password,function(err,user){
					if(err){
						console.log(err)
						res.redirect("/register")
					}
					else{
						passport.authenticate("local")(req,res,function(){
							res.redirect("/campgrounds")
						})
					}
			})
		})

app.get("/login",function(req,res){
	res.render("login")
})
app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){

})

//logout

app.get("/logout",function(req,res){
	req.logout(),
	res.redirect("/campgrounds")
})

//adding the middleware

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}
app.listen(3000,function(req,res){
	console.log("server has started") 
})  

