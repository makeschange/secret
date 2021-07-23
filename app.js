//jshint esversion
require('dotenv').config()
const express = require('express');
const ejs = ('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost: 27017/userDB",{useNewUrlParser: true,useUnifiedTopology: true});
///////////////////
const userSchema = new mongoose.Schema({
  email: String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);
app.get('/', (req,res) => {
  res.render('home');
});
///////////////////
app.route('/register')
.get((req,res) => {
  res.render('register');
})
.post((req,res) => {
 const username = req.body.username;
 const password = req.body.password;
 const newuser = new User({
  email: username,
  password: password
 });
 newuser.save((err) => {
   if(!err){
     res.render('secrets');
   }else{
     console.log(err);
   }
 });
})
///////////////////
app.get('/log-in', (req,res) => {
  res.render('login');
});
app.post('/log-in', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, (err,result) => {
    if(result.password === password){
      res.render('secrets');
    }else{
      res.send("password or username don't match!")
    }
  });
});
///////////////////
app.get('submit', (req,res) => {
  res.render('submit');
});




app.listen(3000, () => {
  console.log("Server running to 3000 port.");
});
