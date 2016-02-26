var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var IssueTypeSchema = new Schema({
	     name:{type:String,required:true},
       author:{type:Schema.Types.ObjectId,ref:'User',required:true}
});

mongoose.model('IssueType', IssueTypeSchema);
