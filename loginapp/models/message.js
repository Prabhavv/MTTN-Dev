var mongoose = require('mongoose');

//Message Schema
let messageSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type : String,
    required : true
  }
});

let Message = module.exports = mongoose.model('Message',messageSchema);
