//Install express, body-parser, node, mongodb, and bcrypt for this code

//Initialize Express and Body Parser, as well as the route we shall use
//Initialize the userController
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); 
const adminController = require("./admin/controllers/adminController");
const adminTasksController = require("./admin/controllers/adminTasksController");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './public/uploads/')); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });


// Importing the employee controller 
const employeeController = require("./employee/controllers/employeeController");

//Connect app to admin controller
app.use(express.json());
app.use("/admin", adminController);
app.use("/adminTasks", adminTasksController);
app.use(express.static(path.join(__dirname, 'admin')));
app.use("/assets", express.static(path.join(__dirname, "admin", "assets")));

// Connect app to employee controller

app.use("/employee", employeeController);
app.use(express.static(path.join(__dirname, 'employee')));
app.use("/assets", express.static(path.join(__dirname, "employee", "assets")));


app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
  });

// Handle a GET request to the '/employee/' route. 
//When a user accesses this route, send the 'login2.html' file as the response.
app.get('/employee/', (req, res) => {
    res.sendFile(path.join(__dirname, 'employee', 'login2.html'));
  });

  
  
  // Endpoint for handling file uploads
  app.post('/upload', upload.single('file'), (req, res) => {
    try {
      // Check if req.file is defined
      if (!req.file) {
          throw new Error('No file provided');
      }

      // Access the uploaded file information
      const fileName = req.file.filename;
      const filePath = req.file.path;

      // Perform further processing, database storage, etc.

      res.json({ fileName, filePath });
  } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Port that app is listening to 
app.listen(3000, () => {
  console.log("Project is running!");
})




