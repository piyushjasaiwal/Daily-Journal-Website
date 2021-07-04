//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Whether you’re looking for a tool to record your daily emotions and activities in a reflective journal, keep track of milestones, or even record your dreams in a dream journal, We have you covered.Daily Journal gives you all the tools you need to focus on the ideas you want to preserve, rather than the process of writing itself.";
const aboutContent = "The journal—it’s one of those things that can be as useless as a piece of trash, or one of the most valuable things you’ve ever owned… It all depends on what you fill that journal’s pages with.";
const contactContent = "Have any queries related to website?";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/journalDB", {
  useNewUrlParser: true
});

const journalSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Journal = mongoose.model("Journal", journalSchema);

app.get("/", function(req, res) {
  Journal.find({}, function(err, posts) {
    res.render("home", {
      homeStarting: homeStartingContent,
      posts: posts
    });
  });

});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactcontent: contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutcontent: aboutContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postID", function(req, res) {
  const requestedId = req.params.postID;
  Journal.findOne({
    _id: requestedId
  }, function(err, post) {
    res.render("post", {
      posttofindTitle: post.title,
      posttofindContent: post.content
    });
  })

});

app.post("/compose", function(req, res) {
  const journal = new Journal({
    title: req.body.composetitle,
    content: req.body.composetext
  });
  journal.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
