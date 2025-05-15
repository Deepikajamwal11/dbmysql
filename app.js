require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/adminRouter');
const { connectdb } = require("./dbConnection");

var fileupload = require('express-fileupload');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require("express-flash");

var app = express();
const PORT = process.env.PORT || 4444
connectdb();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileupload());
app.use(flash());
app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true,  
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', adminRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status || 500);
  res.render('error');
});
app.listen(PORT,(req,res)=>{
  console.log(`server is running on PORT ${PORT}`);
})

module.exports = app;
