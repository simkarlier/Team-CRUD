/*
Issue model

Pseudo-model 

Issue
    author:number; (id)
    type:string
    tags: string[]
    description:string
    geometry: {
        type:”point”
        coordinates : [long,lat]
}
creation_date:date;
status: string (created, acknowledged, assigned, in_progress, solved, rejected)
    responsible_author: number; (id user)
    actions : action[id]

*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var IssueSchema = new Schema({
	  name:{type:String,required:true},
      author:{type:Schema.Types.ObjectId,ref:'User',required:true},
      type:{type:String,required:true},
      tags:{type:[String],required:true},
      description:{type:String,required:true},
      geometry:{
      	type : {type: String, enum: ['point'] },
      	coordinates :{type:[Number],required:true,validate:[valArray,"Incorrect number of coordinates"]}
      },
      status: {type: String, enum: ['created', 'acknowledged', 'assigned', 'in_progress', 'solved', 'rejected'] },
      responsible_author:{type:Schema.Types.ObjectId,ref:'User',required:true},
      actions : [],
      creation_date:{type: Date, required:true}
});

function valArray(array){
	return array.length = 2;
}


mongoose.model('Issue', IssueSchema);
