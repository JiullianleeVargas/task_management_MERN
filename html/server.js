//Install express, body-parser, node, mongodb, and bcrypt for this code

//Initialize Express and Body Parser, as well as the route we shall use
//Initialize the userController
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); 
const adminController = require("./admin/controllers/adminController");


// Importing the employee controller 
const employeeController = require("./employee/controllers/employeeController");

//Connect app to admin controller
app.use(express.json());
app.use("/admin", adminController);
app.use(express.static(path.join(__dirname, 'admin')));
app.use("/assets", express.static(path.join(__dirname, "admin", "assets")));

// Connect app to employee controller

app.use("/employee", employeeController);
app.use(express.static(path.join(__dirname, 'employee')));
app.use("/assets", express.static(path.join(__dirname, "employee", "assets")));


app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login2.html'));
  });

// Handle a GET request to the '/employee/' route. 
//When a user accesses this route, send the 'login2.html' file as the response.
app.get('/employee/', (req, res) => {
    res.sendFile(path.join(__dirname, 'employee', 'login2.html'));
  });


//Port that app is listening to 
app.listen(3000, () => {
  console.log("Project is running!");
})




