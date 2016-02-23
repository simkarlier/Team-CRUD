// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validate'); // validate email module


var UserSchema = new Schema({
      firstname:{type:String,required:true},
      lastname:{type:String,required:true},
      role:{type:[String],required:true},
      password:{type:String,required:true},
      email:{type:String,required:true,validate:[validate.email,'invalid email address']}
});




mongoose.model('User', UserSchema);
