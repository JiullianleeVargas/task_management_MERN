
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

// user.get('/new-route', (req, res) => {
//   console.log("inside the new route function")
//   res.type('html').sendFile(path.join(__dirname, '..', 'index2.html'));
//   console.log(__dirname);
// })



user.get('/tasks', (req, res) => {
  // console.log("inside the new route function")
  res.type('html').sendFile(path.join(__dirname, '..', 'index2.html'));
  // console.log(__dirname);
})


user.get('/login', (req, res) => {
  // console.log("inside the new route function")
  res.type('html').sendFile(path.join(__dirname, '..', 'login2.html'));
  // console.log(__dirname);
})

user.get('/calendar', (req, res) => {
  // console.log("inside the new route function")
  res.type('html').sendFile(path.join(__dirname, '..', 'apps-calendar.html'));
  // console.log(__dirname);
})

user.get('/reports', (req, res) => {
  // console.log("inside the new route function")
  res.type('html').sendFile(path.join(__dirname, '..', 'reports.html'));
  // console.log(__dirname);
})

user.post('/login', async function(req, res) {

    let email = req.body.email;
    let password = req.body.password;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        // console.log("No email or password provided");
        res.status(400).json({ error: "Both email and password are required." });
    } else {
      const client = new MongoClient('mongodb://0.0.0.0:27017');
      

      //Connect to DB named 'task_management' and collection named 'employees
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('employees');
      console.log("DB connect login");

      const employee = await usersCollection.findOne({ email });
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
   

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
            

            res.json({ redirect: '/employee/tasks'});
           
           
        
          }
      }

      else {
        console.log("Username or password is incorrect");
        res.status(404).json({ error: 'Username and password incorrect' });
      }

    }

})

user.get('/getEmployeeTasks', async (req, res) => {
 
  console.log("Entered getEmployeeTasks controller")
  const client = new MongoClient('mongodb://0.0.0.0:27017');
  

  try {

    //employeeTasks = [];
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
      console.log("EmployeeID: ", employeeID);
      await client.connect();

      const database = client.db('task_management');
      const employeeCollection = database.collection('employees');
      const taskCollection = database.collection('tasks');
      const teamCollection = database.collection('teams');

      // Convert the employeeID into an object ID so the database can use it
      // const employeeId = new ObjectId("655a5b8c70fc2aea0f9a523a");
      const employeeId = new ObjectId(employeeID);
      // console.log(employeeId)

      const employee = await employeeCollection.findOne({ "_id": employeeId });
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }

      // const team = await teamCollection.findOne({ "employees": employeeId });

      // Retrieve detailed task information for each task ID
      const taskIds = employee.tasks.map(taskId => new ObjectId(taskId));
      //const taskIds2 = team.tasks.map(taskId => new ObjectId(taskId));
      const employeeTasks = await taskCollection.find({ "_id": { $in: taskIds } }).toArray();
      //const teamTasks = await teamCollection.find({ "_id": { $in: taskIds2 } }).toArray();

      console.log(employeeTasks)
      // employeeTasks.push(individualTasks);
      // employeeTasks.push(teamTasks);

      res.json(employeeTasks);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      await client.close();
  }
});

// Controller/route to fetch tasks from a team of which the employee belongs to
user.get('/getTeamTasks', async (req, res) => {
 
  console.log("Entered getTeamTasks")
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
      const teamCollection = database.collection('teams');

      // Convert the employeeID into an object ID so the database can use it
      // const employeeId = new ObjectId("655a5b8c70fc2aea0f9a523a");
      const employeeId = new ObjectId(employeeID);
      // console.log(employeeId)

      const employee = await employeeCollection.findOne({ "_id": employeeId });
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }

      // Queries the team collection and searches the employees array for that specific emplooyee and turns it into array.
      const teamWithEmployee = await teamCollection.find({employees: employee._id}).toArray()
      // Stores the task ID's and uses flat map cause teams have arrays of tasks, and it grabs the entire arrays of tasks
      // Since we dont want the arrays of arrays, we flaten it
      const taskIDs = teamWithEmployee.flatMap(doc => doc.tasks)
      
      //Then we use that array to get the tasks from the task collection
      const teamEmployeeTasks = await taskCollection.find({ "_id": { $in: taskIDs } }).toArray();

      //Return the employees team tasks
      res.json(teamEmployeeTasks);
      console.log("Team Tasks: ", teamEmployeeTasks)


      
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      await client.close();
  }
});

user.get('/getUserInformation', async (req, res) => {
 
  console.log("Entered the getUserInformation")
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


      // Convert the employeeID into an object ID so the database can use it
      // const employeeId = new ObjectId("655a5b8c70fc2aea0f9a523a");
      const employeeId = new ObjectId(employeeID);
      // console.log(employeeId)

      const employee = await employeeCollection.findOne({ "_id": employeeId });
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }

      // Extracting the firstname, lastname and email from the extracted employee
      const {f_name, l_name, email} = employee
      

    // Return the information in the response
      res.json({ f_name, l_name, email });
      console.log("Employees first name: ", f_name)
      console.log("Employees last name: ", l_name)
      console.log("Employees email:  ", email)
  
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      await client.close();
  }
});


// Controller that changes the status in the database
// Recieves in the req the userID, taskID and newStatus
user.post('/setStatus', async (req, res) => {

  console.log("Entered setStatus")
  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
    // Extracking the userID from the request headers
    const cookies = req.headers.cookie.split(';').map(cookie => cookie.trim());
    const employeeIdCookie = cookies.find(cookie => cookie.startsWith('employeeID='));

    // Extracting the taskID of the task to change and the new status
    const taskID = req.body.taskID;
    const newStatus = req.body.newStatus;

    console.log("TaskID: ", taskID)
    console.log("newStatus: ", newStatus)

    if (!employeeIdCookie) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Here I have the parsed ID
    const employeeID = employeeIdCookie.split('=')[1];

    await client.connect();

    // Grabing the database
    const database = client.db('task_management');

    //Grabing the collection to search for the user
    const employeeCollection = database.collection('employees');

    // Grabing the task collection to search for the users tasks
    const taskCollection = database.collection('tasks');

    // Converting the userID into an obejctID so I can search in the database
    const employeeId = new ObjectId(employeeID);
    const employee = await employeeCollection.findOne({ "_id": employeeId });

    // Update the status of the specified task
    // Also converting the ID to objectID
    await taskCollection.updateOne(
      { "_id": new ObjectId(taskID) },
      { $set: { "status": newStatus } }
    );

    // Retrieve updated task information if needed
    const updatedTaskIds = employee.tasks.map(taskId => new ObjectId(taskId));
    const updatedEmployeeTasks = await taskCollection.find({ "_id": { $in: updatedTaskIds } }).toArray();
    
    console.log("Updated Employee Tasks: ", updatedEmployeeTasks)

    res.json(updatedEmployeeTasks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});


user.get("/getFile", async (req, res) => {

  try {
      const fileName = req.query.file; // Use req.query to get query parameters
      const filePath = path.join(__dirname, '../../public/uploads', fileName); // Adjust the path if needed

      // Send the file to the client
      res.sendFile(filePath);
  } catch (error) {
      console.error('Error serving file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

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
