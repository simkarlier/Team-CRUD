var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IssueSchema = new Schema({
	  name:{type:String,required:true},
      author:{type:Schema.Types.ObjectId,ref:'User',required:true},
      type:{type:String,required:true},//, validate:[valType,"Undefined type"]},
      tags:{type:[String],required:true},
      description:{type:String,required:true},
      location:{
      	type: { type: String,default: "Point" },
      	coordinates :{type:[Number],required:true,validate:[valCoords,"Incorrect coordinates"]}
      },
      status: {type: String, enum: ['created', 'acknowledged', 'assigned', 'in_progress', 'solved', 'rejected'] },
      responsibleUser:{type:Schema.Types.ObjectId,ref:'User',required:true},
      actions : [],
      creationDate:{type: Date, required:true}
});

IssueSchema.index({
	location: '2dsphere'
});

//validates the coordinates
function valCoords(array){
  
  if(typeof array === 'undefined'){
    return false;
  }

  var res = array.length==2;
  res = res && (array[0]>=-180 && array[0]<=180);
  res = res && (array[1]>=-85 && array[1]<=85);

  return res;
  
 
}

// Asynchronous validator for checking if the issue type is valid (in issueType)
IssueSchema.path('type').validate(function (value, respond) {
    mongoose.model('IssueType').find({name:value},function(err,result){
      if(result.length == 0){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known')
      }
    });
}, '');


// Asynchronous validator for checking if the author exists
IssueSchema.path('author').validate(function (value, respond) {
    mongoose.model('User').find({id:value},function(err,result){
      if(result.length == 0){
          respond(false, 'There\'s no author corresponding with this ID');
      }else{
          respond(true,'OK')
      }
    });
}, '');

// Asynchronous validator for checking if the responsible users exists
IssueSchema.path('responsibleUser').validate(function (value, respond) {
    mongoose.model('User').find({id:value},function(err,result){
      if(result.length == 0){
          respond(false, 'There\'s no responsibleUser corresponding with this ID');
      }else{
          respond(true,'OK')
      }
    });
}, '');


mongoose.model('Issue', IssueSchema);
