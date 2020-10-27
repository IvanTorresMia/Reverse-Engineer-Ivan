// Requiring necessary npm packages
var express = require("express");
// Creates a session middleware, which essentially givees the user a unique session. 
var session = require("express-session");
// Requiring passport as we've configured it
// requiring passport which we have configured and set under passport.js
var passport = require("./config/passport");



// Setting up port and requiring models for syncing
// Here we are giving a host to the app by either using the deployed site or the express local host 8080 site.
var PORT = process.env.PORT || 8080;

// requiring models in order to sync the data base. 
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
// Here we user the express app to 
var app = express();
// This allows us to parse data in nested object form. 
app.use(express.urlencoded({ extended: true }));
// This allows us to recognize the incoming request as a json object. 
app.use(express.json());
// Used to load the files that are in the directory public and recognizes them as static.
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
