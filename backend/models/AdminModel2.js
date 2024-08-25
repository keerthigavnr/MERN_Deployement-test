import mongoose from "mongoose";
//theory
const AdminSchema2 = mongoose.Schema({
    date: { type: Date, required: true },
    session: { type: String, required: true },
    subjectCode:{type:String},
    hallno:{type:String},
    facultyID: { type: Number },
    facultyConfirmStatus:{type:Boolean,default:false},


  });
  
  export const AdminDB2=mongoose.model('AdminTask2', AdminSchema2);
  
  