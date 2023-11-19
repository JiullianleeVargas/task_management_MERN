//Install express, body-parser, node, mongodb, and bcrypt for this code

//Initialize Express and Body Parser, as well as the route we shall use
//Initialize the userController
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); 
const adminController = require("./admin/controllers/adminController");

//Connect app to user controller
app.use(express.json());
app.use("/admin", adminController);
app.use(express.static(path.join(__dirname, 'admin')));
app.use("/assets", express.static(path.join(__dirname, "admin", "assets")));

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login2.html'));
  });

//Port that app is listening to 
app.listen(3000, () => {
  console.log("Project is running!");
})




