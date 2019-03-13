//jshint esversion:6
require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = ar
('express-session');


const app = express();





const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;


const User = mongoose.model("User",userSchema);

app.get('/',function(req,res){
  res.render("home");
});

app.get('/login',function(req,res){
  res.render("login");
});

app.get('/register',function(req,res){
  res.render("register");
});



app.post('/register',function(req,res){

});


app.post('/login',function(req,res){

});









app.listen(3000,function(){
  console.log("Server started on port 3000");
})
