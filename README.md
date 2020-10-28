# Reverse-Engineer-Ivan

# Description

Hello! Welcome to my way awesome description of the code behind this Passport Demo. In this walk through if this code you will be able to know what everything is doing and why it's doing and hopefully you as a developer could understand and utilize this code for yourself.

# Table of Contents:

- [Dependencies](#Dependencies)
- [Installation](#Installation)
- [Code Explained](#Code-Explained)
- [Technologies](#Technologies)
- [Credits](##Credits)
- [License](##Licence)
- [Author](#Author)

# Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Express-Session](https://www.npmjs.com/package/handlebars)
- [MySQL2](https://www.npmjs.com/package/mysql)
- [Passport](https://www.npmjs.com/package/mysql)
- [Passport-local](https://www.npmjs.com/package/mysql)
- [Sequelize](https://www.npmjs.com/package/mysql)

# Installation

In Order to install the dependencies you have to do a

```
mpm install
```

In order to run the code you have to type this in your terminal.

```
node server.js
```

This is deployed but if you wanted to run through express you have to use this.

```
var PORT = process.env.PORT || 8080;
```

# Code Explained

## Server.js

The server is where everything is brought together and is well served. I think of it as every other folder and file is cooking up the meal and adding every nessesary ingridient. But the server serves the food on the table and makes it appear.

Server.js set up your ports in order to run the application. Here you can see the app through local host or express. We also require our models in order to sync the data base. Other features are the express.json and express.static, one allows us to parse out data in object form. The other tells the server to look for static files in the "public" folder. The server is syncing the data base and listening for PORT.

## config

### config.json

Config.json establashing our connection to our databbase telling it to look for the database name, username, host, and our password to our work bench in this case we are using mysql.

### passport.js

This file's purpose is to set up authentication for the user to be able to create an account, log in and log our of it. Here we also use "passport-local" to let the app know that we are specifically using email and passoword for the authentication. We also are able to see error checing, if the user writes a wrong password or email then they get an error. It also validates that the account has already been created if the email is already in the data base. Then on lines 44 to 46 we establish a session.

## middleware

### isAuthenticated.js

Here it checks if the user is currently logged in then it redirects you to the home page. If the req.user is true, in other words if the user is logged in then they access their page data other wise they are redirected to the home page.

## models

### index.js

index.js is a file provided by sequilize, which allows us to use built in orm's in order to manipulate our data.


### user.js

User.js is used to to create a user password and email. Here we validate both values and hash the password using bcryptjs which is a dependency isntalled into our package.json file. Below the code we are using bycript and a addHook so that before the user is created we can automaitcally hash their passoword.

- Creating our models for our user name and email

```
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
```

- Checking if the unhashed password that the user has entered can be compared to the one in the data base. We are also using addHook and bycrypt to hash the password before the user is created.

```
 User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
```

## routes

### api-routes.js

Here on our api-routes page we are requiring our models and our passport in order to recieve signals from our front end when creating a user, login and getting data from our user.

we have two post and two get's

first post Here we are login in the user and using passport outhentication if and only if the user inputs correct data for their password and email then they will be sent to their member page, other wise, they will recieve an error.

```
app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

```

- Here we are recieveing signals from the front end and creating a user with a post request.

```
app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

```

* Here the user is being logged out uppon request and being redirected to the login page.

```
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
```
* Here we are sending the user email and id data if the user is logged in, if not it will send an empty object, in other words nothing. 

```
   app.get("/api/user_data", function(req, res) {
    if (!req.user) {
          res.json({});
    } else {
    res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};

```

### html-routes.js
* Here we require "path" and our middleware in order to check if the user is logged in. This is were our main paths live like our sign up page, our login page and our members page.

* If the user is logged in then it will redirect them to the members page, otherwise it will send them to signup page.
```
app.get("/", function(req, res) {
     if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
```

* The login route checks if the user is alredy logged in then it will redirect them to the members page, other wise it will take them to the login page. 

```
app.get("/login", function(req, res) {
     if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
```
* Here in our members route we check to see if the user isn't logged in then they get taken to the sign up page, this is done using our is Authenticated middleware.

```
app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

};
```

## public
Here in public, all of our static files live. This is why we have the code bellow in our server.js to be able to access these files. 
```
app.use(express.static("public")); 
```

### HTML

* login.html, members.html, and signup.html live in here. This is our main front end skeleton for our pages. We also have hooks like id's and classes to be able to use them in our js files and send signals to our routes. ie.

```
<!-- This has an id of email-input, we use this as a hook to be able to take the value of the email-form -->
 <input type="email" class="form-control" id="email-input" placeholder="Email">


<!-- Here we have a class which allows us to say, that on "submit" we can make an action, in this case it's making an ajax call to our routes -->
<button type="submit" class="btn btn-default">Sign Up</button>
```


## js

* login.js, members.js and sign up.js live in this folder. Here is where all of our ajax call magic happens, this is where we connect our front end and our back end. For example in our login.js we create an object for our email and password once we validate and clear the inputs then we make an ajax call with the post method to send the email and password to our routes. ie.

```
function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function() {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

```

## stylesheet

### style.css
Here is where some additional styling happens for our webstie which is linked into our html files. 
## package.json
Package.json mainly stores all of our dependencies and our scripts for example our server.js which is set to start our site and nodemon server.js to watch our app.

## .gitignore
this file is used to ignore all the files and folders we don't want to show up when pushing our app though github 

# Technologies

- [JavaScript](https://www.w3schools.com/js/)
- [MySQL](https://www.mysql.com/)
- [Express](https://expressjs.com/)
- [JawsDB](https://elements.heroku.com/addons/jawsdb)
- [jQuery](https://jquery.com/)
- [HTML](https://www.w3schools.com/html/)
- [CSS](https://www.w3schools.com/css/)

## Credits

- Credits for this homework assignment go out to Jerome, Manuel, Kerwin, Roger, and all of my classmates who helped me in study sessions. As well as my tutor who helped me a ton with understanding this homework assignment.
- [StackOverFlow](https://stackoverflow.com/)

## License]

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://www.mit.edu/~amini/LICENSE.md)

# Author

Ivan Torres

[![GitHub](https://img.shields.io/badge/github-%23100000.svg?&style=for-the-badge&logo=github&logoColor=white)](https://github.com/IvanTorresMia)

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/IvanTorresMia)
