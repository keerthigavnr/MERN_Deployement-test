import mongoose from "mongoose";
//practical
const AdminSchema = mongoose.Schema({
    department: { type: String, required: true },
    date: { type: Date, required: true },
    session: { type: String, required: true },
    subjectCode: { type: String, required: true },
    numRegisteredCandidates: { type: Number, default: 0 },
    numExaminedCandidates: { type: Number, default: 0 },
    externalFacultyId: { type: Number, ref: 'Faculty' },
    externalConfirmStatus:{type:Boolean,default:false},
    internalFacultyId: { type: Number, ref: 'Faculty' },
    internalConfirmStatus:{type:Boolean,default:false},
    skilledAssistantId: { type: Number, ref: 'Faculty' },
    skilledConfirmStatus:{type:Boolean,default:false},
    });
  
  export const AdminDB=mongoose.model('AdminTask', AdminSchema);
  
  