var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var IssueSchema = new Schema({
	  name:{type:String,required:true},
      author:{type:Schema.Types.ObjectId,ref:'User',required:true},
      type:{type:String,required:true}, //validate:[valType,"Undefined type"]
      tags:{type:[String],required:true},
      description:{type:String,required:true},
      geometry:{
      	type : {type: String, enum: ['point'] , default: "point"},
      	coordinates :{type:[Number],required:true,validate:[valArray,"Incorrect number of coordinates"]}
      },
      status: {type: String, enum: ['created', 'acknowledged', 'assigned', 'in_progress', 'solved', 'rejected'] },
      responsible_user:{type:Schema.Types.ObjectId,ref:'User',required:true},
      actions : [],
      creation_date:{type: Date, required:true}
});

IssueSchema.index({
	geometry: '2dsphere'
});

function valArray(array){
	return array.length == 2;
}

/*
function valType(type){
	Type.find(function(err, types){
    if(err){
      res.status(500).send(err);
      return;
    }
  	
  })
}

*/ 

mongoose.model('Issue', IssueSchema);
