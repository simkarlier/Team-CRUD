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
      	coordinates :{type:[Number],required:true,validate:[valArray,"Incorrect number of coordinates"]}
      },
      status: {type: String, enum: ['created', 'acknowledged', 'assigned', 'in_progress', 'solved', 'rejected'] },
      responsibleUser:{type:Schema.Types.ObjectId,ref:'User',required:true},
      actions : [],
      creationDate:{type: Date, required:true}
});

IssueSchema.index({
	location: '2dsphere'
});

function valArray(array){
	return array.length == 2;
}

// Asynchronous validator pour checking if the issue type is valid (in issueType)
IssueSchema.path('type').validate(function (value, respond) {
    mongoose.model('IssueType').find({name:value},function(err,result){
      if(result.length == 0){
          respond(false, 'There\'s no issue type like this');
      }else{
          respond(true,'Ok the type is known')
      }
    });
}, 'this message does not matter');

mongoose.model('Issue', IssueSchema);
