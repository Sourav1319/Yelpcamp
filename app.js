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
	User 				 =require("./models/user"),
	methodoverride		 =require("method-override"),
	flash 				 =require("connect-flash"),
	app 				 =express()

//requirinfg routes
var commentRoutes	 =require("./routes/comment"),
	campgroundRoutes =require("./routes/campground"),
	auth_indexRoutes =require("./routes/auth_index")

// seedDB();

mongoose.connect("mongodb://localhost/yelpcamp",{useNewUrlParser:true})
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"));
app.use(methodoverride("_method"))
app.use(flash());

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


//passing the value of currentuser to all the routes available
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.success=req.flash("success")
	res.locals.error=req.flash("error")
	next();
})	


//putting the declared routes in action
app.use(auth_indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



app.listen(3000,function(req,res){
	console.log("server has started") 
})  

