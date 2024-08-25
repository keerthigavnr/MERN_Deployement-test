import { Faculty } from "./models/FacultyModel.js";
import express, { request, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {mongoDBURL } from "./config.js";
import cors from 'cors'
const app=express()
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { AdminDB } from "./models/AdminModel.js";
import { AdminDB2 } from "./models/AdminModel2.js";
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer'


dotenv.config();

app.use(express.json())
app.use(
  cors({
    origin: "https://mern-deployement-frontend.vercel.app/",
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload file and return file path
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filePath = `/images/${req.file.filename}`;
    res.status(200).json({ filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

// Update user profile
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("An error occurred. Please try again later.");
  }
});




app.get('/admindata_practical',async (req, res) => {
  try {
    const adminData1 = await AdminDB.find();
    res.json(adminData1);
    
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).send("An error occurred. Please try again later");
  }
 
})


app.get('/admindata_theory',async (req, res) => {
  try {
    const adminData2 = await AdminDB2.find();
    res.json(adminData2);
    console.log(adminData2)
    
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).send("An error occurred. Please try again later");
  }
 
})

app.post('/newtaskpractical', async (req, res) => {
  try {
    const { department, date, session, subjectCode, numRegisteredCandidates, numExaminedCandidates, externalFacultyId, internalFacultyId, skilledAssistantId } = req.body;
   const newTask = new AdminDB({
      department,
      date,
      session,
      subjectCode,
      numRegisteredCandidates,
      numExaminedCandidates,
      externalFacultyId,
      internalFacultyId,
      skilledAssistantId,
          });
  await newTask.save();

    res.status(201).json({ message: 'Task added successfully',
    task: newTask 
   });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// Update task route
app.put('/updatetaskpractical/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { department, date, session, subjectCode, numRegisteredCandidates, numExaminedCandidates, externalFacultyId, internalFacultyId, skilledAssistantId } = req.body;

    // Find the task by ID and update its fields
    const updatedTask = await AdminDB.findByIdAndUpdate(taskId, {
      department,
      date,
      session,
      subjectCode,
      numRegisteredCandidates,
      numExaminedCandidates,
      externalFacultyId,
      internalFacultyId,
      skilledAssistantId
    }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});


// DELETE route to handle record deletion
app.delete('/deletetaskpractical/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find the record by id and delete it
    const deletedRecord = await AdminDB.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', deletedRecord });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route to handle record deletion
app.delete('/deletetasktheory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find the record by id and delete it
    const deletedRecord = await AdminDB2.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', deletedRecord });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/newtasktheory', async (req, res) => {

  try {
    const { date, session,hallno,facultyID } = req.body;
   const newTask = new AdminDB2({
      date,
      session,
      hallno,
      facultyID
    });
  await newTask.save();

    res.status(201).json({ message: 'Task added successfully',
    task: newTask 
   });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

app.post('/confirmExam', async (req, res) => {
  try {
    const { examId, type, facultyID } = req.body;

    // Determine the field to update based on the type
    let updateField;
    if (type === 'External Faculty') {
      updateField = { externalConfirmStatus: true };
    } else if (type === 'Internal Faculty') {
      updateField = { internalConfirmStatus: true };
    } else if (type === 'Skilled Assistant') {
      updateField = { skilledConfirmStatus: true };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid faculty type' });
    }

    // Update the respective confirmation status in the database
    const updatedExam = await AdminDB.findByIdAndUpdate(
      examId,
      { $set: updateField },
      { new: true }
    );

    if (updatedExam) {
      res.status(200).json({ success: true, message: 'Exam confirmed successfully', updatedExam });
    } else {
      res.status(404).json({ success: false, message: 'Exam not found' });
    }
  } catch (error) {
    console.error('Error confirming exam:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});

app.post('/confirmTheoryExam', async (req, res) => {
  try {
    const { examId, facultyID } = req.body;

    // Update the confirmation status in the database
    const updatedExam = await AdminDB2.findByIdAndUpdate(
      examId,
      { $set: { facultyConfirmStatus: true } }, // Assuming you are setting the confirmation status to true
      { new: true }
    );

    if (updatedExam) {
      res.status(200).json({ success: true, message: 'Theory exam confirmed successfully', updatedExam });
    } else {
      res.status(404).json({ success: false, message: 'Theory exam not found' });
    }
  } catch (error) {
    console.error('Error confirming theory exam:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});


app.get('/users', authenticateToken,async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.user.email });
    if (faculty) {
      res.json(faculty);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("An error occurred. Please try again later");
  }
 
})

app.get('/facultydetails',async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
    
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res.status(500).send("An error occurred. Please try again later");
  }

app.get('/fetchfaculty/:id', async (req, res) => {
    try {
      const faculty = await Faculty.findOne({ facultyID: req.params.id }); // Assuming facultyID is the field containing the faculty ID
  
      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }
  
      // If found, send the faculty details
      res.status(200).json(faculty);
    } catch (error) {
      console.error('Error fetching faculty details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

})
app.delete('/deletefacultydetail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Faculty.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', deletedRecord });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addfaculty', async (req, res) => {
  try {
     const existingFacultyID = await Faculty.findOne({ facultyID: req.body.facultyID });
     if (existingFacultyID) {
         return res.status(400).json({ message: "Faculty ID already exists. Please choose another one." });
     }

     const existingEmail = await Faculty.findOne({ email: req.body.email });
     if (existingEmail) {
         return res.status(400).json({ message: "Email already in use. Please use a different email address." });
     } const newUser = new Faculty({
      username: req.body.username,
      email: req.body.email,
      facultyID: req.body.facultyID,
      designation: req.body.designation,
      college_code: req.body.college_code,
      bank_acc_no: req.body.bank_acc_no,
      ifsc_code: req.body.ifsc_code,
      branch: req.body.branch,
      pan_no: req.body.pan_no,
      affiliation:req.body.affiliation,
      ph_no:req.body.ph_no,
      branch:req.body.branch,
      pan_no:req.body.pan_no,
      aadhar_no:req.body.aadhar_no

    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred. Please try again later");
  }
})

app.post('/users', async (req, res) => {
    try {
       const existingFacultyID = await Faculty.findOne({ facultyID: req.body.facultyID });
       if (existingFacultyID) {
           return res.status(400).json({ message: "Faculty ID already exists. Please choose another one." });
       }

       const existingEmail = await Faculty.findOne({ email: req.body.email });
       if (existingEmail) {
           return res.status(400).json({ message: "Email already in use. Please use a different email address." });
       }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new Faculty({
        username: req.body.username,
        email: req.body.email,
        facultyID: req.body.facultyID,
        password: hashedPassword,
        designation: req.body.designation,
        college: req.body.college,
        bank_acc_no: req.body.bank_acc_no,
        ifsc_code: req.body.ifsc_code,
        branch: req.body.branch,
        pan_no: req.body.pan_no,
        affiliation:req.body.affiliation
      });
      await newUser.save();
      res.status(201).send("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("An error occurred. Please try again later");
    }
  })
// Define a new route for updating user profiles
//   app.put('/users/:id', async (req, res) => {
//     try {
//       const userId = req.params.id;
//       console.log("Received PUT request body:", req.body);
  
//       const { username,
//         email,
//         ph_no,
//         facultyID,
//         designation,
//         affiliation,
//         bank_acc_no,
//         ifsc_code,
//         branch,
//         pan_no,
//         aadhar_no
//       } = req.body;
  
//       // Find the task by ID and update its fields
//   const existingFaculty = await Faculty.findByIdAndUpdate(userId, {
//         username,
//         email,
//         ph_no,
//         facultyID,
//         designation,
//         affiliation,
//         bank_acc_no,
//         ifsc_code,
//         branch,
//         pan_no,
//         aadhar_no
//       }, { new: true });
//       if (!existingFaculty) {
//         return res.status(404).json({ message: "User not found" });
//     }


// console.log("Updated user data:", existingFaculty);

// await existingFaculty.save();
// return res.status(200).json({ message: "User updated successfully", user: existingFaculty });
// } catch (error) {
// console.error("Error updating user:", error);
// return res.status(500).json({ message: "An error occurred while updating user" });
// }
//   });

// Route to fetch assigned exams for a specific faculty ID
app.get('/assignedExams', async (req, res) => {
  const { facultyID } = req.query;

  try {
    // Find the faculty by facultyId to ensure it exists
    const faculty = await Faculty.findOne({ facultyID: facultyID });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Fetch assigned exams from the database based on the facultyId
    const assignedExams = await AdminDB.find({
      $or: [
        { externalFacultyId: facultyID },
        { internalFacultyId: facultyID },
        { skilledAssistantId: facultyID }
      ]
    });

    res.json(assignedExams);
  } catch (error) {
    console.error('Error fetching assigned exams:', error);
    res.status(500).json({ error: 'An error occurred while fetching assigned exams.' });
  }
});


// Route to fetch assigned theory exams for a specific faculty ID
app.get('/assignedTheoryExams', async (req, res) => {
  const { facultyID } = req.query;

  try {
    // Fetch assigned theory exams from the database based on the facultyId
    const assignedTheoryExams = await AdminDB2.find({
      facultyID: facultyID
    });

    if (assignedTheoryExams.length == 0) {
      return res.status(404).json({ error: 'No assigned theory exams found for this faculty ID.' });
    }

    res.json(assignedTheoryExams);
  } catch (error) {
    console.error('Error fetching assigned theory exams:', error);
    res.status(500).json({ error: 'An error occurred while fetching assigned theory exams.' });
  }
});



export const authenticateAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('Forbidden: You don\'t have permission to access this resource.');
  }
  next();
};

app.get('/admin', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const admin = await Faculty.findOne({ email: req.user.email });
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).send('An error occurred. Please try again later');
  }
});

app.post("/forgot-password", (req, res) => {
  
  const { email } = req.body;
  Faculty.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vnrkeerthiga@gmail.com",
        pass: "vhrf djwe szid jayn",
      },
      timeout: 10000,
    });

    const id=user._id;
    var mailOptions = {
      from: "vnrkeerthiga@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:5173/reset_password/${id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ Status: "Error", Message: error.message });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
});

app.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              Faculty.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
      }
  })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

let refreshTokens = [];

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ email: user.email });
    res.json({ accessToken: accessToken });
  });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});
app.post('/users/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const faculty = await Faculty.findOne({
      $or: [{ email: identifier }, { facultyID: identifier }],
    });
    if (!faculty) {
      return res.status(400).json({ message: "User not found. Please register." });
    }
    if (await bcrypt.compare(password, faculty.password)) {
      const accessToken = generateAccessToken({ email: faculty.email, isAdmin: faculty.isAdmin });
      const refreshToken = jwt.sign({ email: faculty.email, isAdmin: faculty.isAdmin }, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      const role = faculty.isAdmin ? "Admin" : "User"; 
      res.json({ accessToken, refreshToken, role });
    } else {
      res.status(401).json({ message: "Incorrect password. Please try again." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred. Please try again later");
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");

    app.listen(3003, () => {
      console.log(`App is listening to port: 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

