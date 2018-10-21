const express = require('express');
const router = express.Router();


//Bringing in the models
var Message = require('../models/message');


//Delete request to delete the messages
router.delete('/:id',function(req,res){
  var query = {_id:req.params.id}

  Message.remove(query,function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});


//Sending message Route
router.get('/send',ensureAuthenticated,function(req,res){
  res.render('send_messages',{
    title: "Send Message"
  });
});

//Catching the messages sent
router.post('/send',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('send_messages',{
      title:'Send Messages',
      errors:errors
    });
  }else{

    let message = new Message();
    message.title = req.body.title;
    message.author = req.body.author;
    message.body = req.body.body;

    message.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        req.flash('success','Message added');
        res.redirect('/messages/send');
      }
    });
  }

});


//Getting the messages from the db
router.get('/:id',function(req,res){
  Message.findById(req.params.id,function(err,message){
    res.render('mes',{
      message:message
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/login');
    req.flash('danger', 'Please login');
  }
}


module.exports = router;
