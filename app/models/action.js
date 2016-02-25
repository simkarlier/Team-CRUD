// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Validate the comment, true if the action type is comment
var commentValidator = function(comment){
  if(comment){
    if(this.type == 'comment'){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

// Validate the statusChange, true if the action type is status change
var statusChangeValidator = function(status){
  if(status){
    if(this.type == 'statusChange'){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

var ActionSchema = new Schema({
      type:{type:String,required:true,enum:['comment','statusChange']},
      date:{type:Date,required:true},
      newStatus:{type:String, validate: [statusChangeValidator, 'A status change can\'t be definited in a comment action']},
      comment:{type:String, validate: [commentValidator, 'A comment can\'t be definited in a status change action']},
      authorId:{type:Schema.Types.ObjectId, ref:'User', required:true}
});


mongoose.model('Action', ActionSchema);
