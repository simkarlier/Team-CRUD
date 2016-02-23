// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
      firstname:{type:String,required:true},
      lastname:{type:String,required:true},
      role:{type:[String],required:true},
      password:{type:String,required:true},
      token:{type:String,required:true}
});

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};



mongoose.model('User', UserSchema);
