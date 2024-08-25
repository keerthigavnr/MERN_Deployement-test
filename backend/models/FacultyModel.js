import mongoose from "mongoose";

const FacultySchema = mongoose.Schema({
  username: { type: String, required: false },
  email: { type: String, required: false, unique: false },
  password: { type: String, required: false },
  facultyID: { type: String, required: false, unique: false },
  isAdmin: { type: Boolean, default: false },
  designation: { type: String, required: false, unique: false },
  college_code: { type: String, required: false, unique: false },
  bank_acc_no: { type: String, required: false },
  ifsc_code: { type: String, required: false, unique: false },
  branch: { type: String, required: false, unique: false },
  pan_no: { type: String, required: false },
  affiliation: { type: String, required: false, unique: false },
  aadhar_no: { type: String, required: false },
  ph_no: { type: String, required: false },
  bank_passbook: { type: String },
  profilePhoto: { type: String },
});

export const Faculty = mongoose.model("Faculties", FacultySchema);
