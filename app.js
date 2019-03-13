//jshint esversion:6
require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const passport = require('passport');
// const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

//initialize session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

//initialize passport
app.use(passport.initialize());
//initiailze passport session
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//create the plugin
//this will handle the salting and hashing of a users login credentials
userSchema.plugin(passportLocalMongoose);

// const secret = process.env.SECRET;

//create the strategy
//serialize a user creates a cookie and stores user information into that cookie

const User = mongoose.model("User", userSchema);

//
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',function(req,res){
  res.render("home");
});

app.get('/login',function(req,res){
  res.render("login");
});

app.get('/register',function(req,res){
  res.render("register");
});

app.get('/secrets',function(req,res){
  if(req.isAuthenticated()){
    res.render('secrets');
  }else{
    res.redirect('/login');
  }

});

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

app.post('/register',function(req,res){
  User.register({username: req.body.username}, req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect('/register');
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect('/secrets');
      });
    }
  });


});


app.post('/login',function(req,res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

req.login(user,function(err){
  if(err){
    console.log(err);
    res.redirect('login');
  }
  else{
    passport.authenticate('local', {failureRedirect: "/login"})(req,res,function(){
      res.redirect('/secrets');
    });
  }
});

});









app.listen(3000,function(){
  console.log("Server started on port 3000");
});
