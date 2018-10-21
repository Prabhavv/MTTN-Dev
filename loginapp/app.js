var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var flash = require('connect-flash');
var session = require('express-session');
const config = require('./config/database');
const passport = require('passport');


mongoose.connect('/mongodb://localhost/messageportal',{ useNewUrlParser: true });
let db = mongoose.connection;
//checking for connection
db.once('open',function(){
  console.log('Connected to MongoDB')
});
//checking the db
db.on('error',function(err){
  console.log(err);
});

//Initializing express app
var app = express();

//Bringing in the models
var Message = require('./models/message');

//Loading pug into the program
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting public folder
app.use(express.static(path.join(__dirname,'public/')));

//Express sessions
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config files
require('./config/passport')(passport);
//Some passport function
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});


//Home route
app.get('/',ensureAuthenticated,function(req,res){
  Message.find({},function(err,messages){
    if(err){
      console.log(err);
    }else{

      res.render("index",{
        title :'Messages',
        messages : messages
      });
    }
  });
});


//Defining Route files
let messages= require('./routes/messages');
app.use('/messages',messages);

let users = require('./routes/users');
app.use('/users',users);

//start server
app.listen(3000,function(){
  console.log('Server started on port 3000');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/login');
    req.flash('danger', 'Please login');
  }
}
