const express = require("express")// importing express...
const app = express()
const port = 3000


// static files
app.use("/css", express.static("./public/css"))
app.use("/src", express.static("./public/src"))
app.use("/img", express.static("./public/img"))

// treat .html files as .ejs files, no need to rename abc.html to abc.ejs
app.engine('.html', require('ejs').__express);

// set views
app.set("views", "./public/views")

// without this, I would need to type abc.html instead abc
//app.set("view engine", "html") nvm, typing .html looks better

// pages.../////////////////////

// index.html
app.get("", function(req, res) {
  res.render("index.html", {})
})

app.get("/bst", function(req, res) {
  res.render("bst.html", {})
})

app.get("/maxHeap", function(req, res) {
  res.render("maxHeap.html", {})
})

app.get("/minHeap", function(req, res) {
  res.render("minHeap.html", {})
})
////////////////////////////////

// Listen on port 3000, local url = localhost:3000
app.listen(port, function() {
  // print on the command line
  console.info("Listening on port " + port)
})
