
// Importing packages 
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const user = express();
user.use(bodyParser.json());
const path = require('path'); 
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing
module.exports = user;

function writeTo(file, data) {
  fs.writeFile(file, JSON.stringify(data), "utf8", (err) => {
    throw err;
  });
}

function readFrom(file) {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, "utf-8");
    data = JSON.parse(data);
    return data;
  }
}

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}


user.use(express.json());

user.get('/new-route', (req, res) => {
  console.log("inside the new route function")
  //console.log('entered new route');
  //res.type('html').sendFile(path.join(__dirname, '..', 'test.html'));
  //console.log(path.join(__dirname, '..', 'admins2.html'));
  res.type('html').sendFile(path.join(__dirname, '..', 'index2.html'));
  console.log(__dirname);
})

user.post('/login', async function(req, res) {

    let email = req.body.email;
    let password = req.body.password;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        console.log("No email or password provided");
        res.status(400).json({ error: "Both email and password are required." });
    } else {
      const client = new MongoClient('mongodb://0.0.0.0:27017');
      

      //Connect to DB named 'task_management' and collection named 'employees
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('employees');
      console.log("DB connect login");

      const employee = await usersCollection.findOne({ email });
   

      // Extracting the employeeID 
      const employeeID = employee._id.toString()
      console.log("employeeID: ", employeeID);

  

      if(employee)
      {
          let result = comparePassword(String(password), String(employee['password']));
          if(result)
          {
            console.log("Succesful log in!");
            res.cookie("employeeID", employeeID, { path: '/employee' })
            console.log("employeeID stored in res.cookie")
            

            res.json({ redirect: '/employee/new-route'});
           
           
        
          }
      }

      else {
        console.log("Username or password is incorrect");
      }

    }

})


// user.get('/getEmployeeTasks', async (req, res) => {
//   const client = new MongoClient('mongodb://0.0.0.0:27017');

//     //Connect to DB named 'task_management' and collection named 'employees'
//     await client.connect();
//     const database = client.db('task_management');
//     const employeeCollection = database.collection('employees');
//     const taskCollection = database.collection('tasks');
//     console.log("DB connect");
   
//     // Grab the specific employee who is logged in to boot up their tasks
//     const employeeId = new ObjectId("655a5b8c70fc2aea0f9a523a")
//     const employee = await employeeCollection.findOne({"_id": employeeId});
//     // console.log("employee:" , employee)
//     const employeeTasks = employee.tasks


//     // const tasks =  await cursor.toArray()
//     // console.log(employeeTasks)
//     res.json(employeeTasks);
//     // await cursor.forEach(admin => {
//     //   console.log(admin.email);
//     //   console.log(admin.password);
//     //   console.log(admin.adminID);
//     //   // ... and so on
//     // });

// })

user.get('/getEmployeeTasks', async (req, res) => {
 
  
  const client = new MongoClient('mongodb://0.0.0.0:27017');
  

  try {

    // Grab the cookies sent in the response header from the index/fetch
      const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());
      const employeeIdCookie = cookies.find(cookie => cookie.startsWith('employeeID='));
      
      //If cookie dont exist
      if (!employeeIdCookie) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Spliting the id from "employeeID="
      const employeeID = employeeIdCookie.split('=')[1];
    
      await client.connect();

      const database = client.db('task_management');
      const employeeCollection = database.collection('employees');
      const taskCollection = database.collection('tasks');

      // Convert the employeeID into an object ID so the database can use it
      // const employeeId = new ObjectId("655a5b8c70fc2aea0f9a523a");
      const employeeId = new ObjectId(employeeID);
      // console.log(employeeId)

      const employee = await employeeCollection.findOne({ "_id": employeeId });

      // Retrieve detailed task information for each task ID
      const taskIds = employee.tasks.map(taskId => new ObjectId(taskId));
      const employeeTasks = await taskCollection.find({ "_id": { $in: taskIds } }).toArray();

      res.json(employeeTasks);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      await client.close();
  }
});



user.post('/register', (req, res) => {
  try {

    let email = req.body.email;
    let password = req.body.password;



    email = email.trim();
    password = password.trim();

    if (email != "" && password != "") {
      const data = readFrom("data.json");
      const employees = data.employees;
      let adminExists = false;
      //let lastIndex = 0;

      for (let index in employees) {
        if (employees[index].email == email) {
          res.send("Username exists");
          userExists = true;
        }

        lastIndex = parseInt(index);
      }

      if (!userExists) {
        let user = {
          username: username,
          password: password
        };

        data.users[`${lastIndex + 1}`] = user;

        writeTo("data.json", data);

        res.send({
          message: "Successfull",
          user: user
        });
      }
    } else {
      res.send('The username and password can`t be empty');
    }
  }
  catch (error) {
    res.status(400).send('Invalid JSON data');
  }

})
