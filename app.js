var bodyParser     = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose       = require("mongoose"),
	express        = require("express"),
	app            = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.engine('html', require('ejs').renderFile);

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://s3-prod.autonews.com/s3fs-public/styles/width_792/public/CANADA01_305219996_AR_1_QPQRHLXRRMUX.jpg",
// 	body: "Hello, this is a blog post!"
// });

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err,data){
		if(err) {
			console.log(err);
		} else {
			res.render("index", {data:data});	
		}
	});
});

app.get("/blogs/new", function(req,res){
	res.render("new");
});

app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("/new");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/programs", function(req, res){
	res.send("programs");
});

app.get("/blogs/piggame", function(req, res){
	res.render("./piggame/pigGame.html");	
});

app.get("/blogs/kakao_clone/index", function(req, res){
	res.render("./kakao_clone/index.html");
});

app.get("/blogs/kakao_clone/chat", function(req, res){
	res.render("./kakao_clone/chat.html");
});

app.get("/blogs/kakao_clone/find", function(req, res){
	res.render("./kakao_clone/find.html");
});

app.get("/blogs/kakao_clone/friends", function(req, res){
	res.render("./kakao_clone/friends.html");
});

app.get("/blogs/kakao_clone/more", function(req, res){
	res.render("./kakao_clone/more.html");
});

app.get("/blogs/kakao_clone/settings", function(req, res){
	res.render("./kakao_clone/settings.html");
});

app.get("/blogs/colorgame", function(req, res){
	res.render("./colorgame/colorGame.html");
});

app.get("/blogs/museumofcandy", function(req, res){
	res.render("./museumofcandy/index.html");
});


app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundData){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {data: foundData});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundData){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {data: foundData});
		}
	});
});

app.put("/blogs/:id", function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/ + req.params.id");
		}
	});
});

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, function(){
	console.log("Server is running!");
});