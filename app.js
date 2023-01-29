//jshint esversion:6
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// database section
mongoose.connect("mongodb://127.0.0.1:27017/userAccountDB",
   { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = mongoose.model('User', userSchema)


// start coding
// GET
app.get('/', (req, res) => {
   res.render('home')
})

app.get('/register', (req, res) => {
   res.render('register')
})

app.get('/login', (req, res) => {
   res.render('login')
})

//POST 
app.post('/register', (req, res) => {
   const userName = req.body.username
   const userPass = req.body.password

   const newUser = new User({
      email: userName,
      password: userPass
   })

   newUser.save(function (err) {
      if (err) {
         console.log(err)
      } else {
         res.render("secrets")
      }
   })
})

app.post('/login', (req, res) => {
   const userName = req.body.username
   const userPass = req.body.password

   User.findOne({ email: userName }, function (err, foundUser) {
      if (err) {
         console.log(err);
      } else {
         if (foundUser) {
            console.log(foundUser);
            if (foundUser.password === userPass) {
               res.render('secrets')
            } else {
               console.log('password salah')
            }
         } else {
            console.log("user tidak ditemukan")
         }
      }
   })
})

app.listen(port, () => {
   console.log(`Run On Port : ${port}`)
})