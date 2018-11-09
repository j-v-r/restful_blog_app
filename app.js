let express             = require("express"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"), 
    app                 = express();
   
// APP CONFIGURATION  

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE MODEL CONFIGURATION 

let blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
    }),
    Blog = mongoose.model("Blog", blogSchema);
    
// ROUTES

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

    // INDEX ROUTE

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

    // NEW ROUTE
    
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

    // CREATE ROUTE
    
app.post("/blogs", (req, res) => {
    // create blog
    // sanitize input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render("new");
        } else {
        // redirect to index
            res.redirect("/blogs");
        }
    });
});

    // SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

    // EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

    // UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    // sanitize input
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

    // DESTROY ROUTE
app.delete("/blogs/:id", (req, res) => {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            //redirect
            res.redirect("/blogs");
        }    
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("SERVER IS RUNNING");
});