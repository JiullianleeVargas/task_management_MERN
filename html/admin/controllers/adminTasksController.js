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
const classes = require('../assets/js/classes');


user.use(express.json());

user.post('/getEmployeeTasks', async (req, res) => {

    uid = req.body.id;
    uid = new ObjectId(uid);
    //console.log("UID: ", uid);
    const client = new MongoClient('mongodb://0.0.0.0:27017');
  
    try {
        //connect to db
        const tasksArray = [];
        
        await client.connect();
        const database = client.db('task_management');
        const usersCollection = database.collection('employees');
        const taskCollection = database.collection('tasks');
        const teamCollection = database.collection('teams');
  
        const cursor = await usersCollection.find({ _id: uid }).toArray();
        const taskIDs = cursor.map(doc => doc.tasks);
        

        for (const taskID of taskIDs[0]) {
            
            const task = await taskCollection.findOne({ _id: taskID });
    
            // Add the employee details to the array
            tasksArray.push(task);
        }

        
  
        const emp = await teamCollection.find({ employees: uid }).toArray();
        const taskIDs2 = emp.map(doc => doc.tasks);
        

        for (const taskID of taskIDs2[0]) {
            const task = await taskCollection.findOne({ _id: taskID });
    
            // Add the employee details to the array
            tasksArray.push(task);
        }

        //console.log(employeesArray);

        res.json({tasks: tasksArray});
        
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
  });


  user.post("/updateTask", async (req, res) => {

    //console.log("updateEmployeeDetails entered");
    let id = req.body.task.dbid;
    id = new ObjectId(id);
    let title = req.body.task.title;
    let desc = req.body.task.description;
    let priority = req.body.task.priority;
    let status = req.body.task.statusT;
    let file = req.body.task.file;
    let start_date = req.body.task.start_date;
    let due_date = req.body.task.due_date;

      
       // Connect to the MongoDB server
       const client = new MongoClient('mongodb://0.0.0.0:27017');
  
       try {
           await client.connect();
 
           // Access the 'task_management' database and 'employees' collection
           const database = client.db('task_management');
           const usersCollection = database.collection('tasks');
   
          //  const employee_db = await usersCollection.findOne({ email: employee.email });
  
          //  if (!employee_db) {
          //   // If the employee is not found, handle the error appropriately
          //   res.status(404).json({ error: 'Employee not found' });
          //   return;
          // }
  
          // const eid = employee_db._id;
  
          //const cursor = await teamCollection.find({ admin: adminID }).toArray();
  
          await usersCollection.updateOne(
            { _id: id },
            {$set:{
              title: title,
              description: desc,
              priority: priority,
              status: status,
              file: file,
              start_date: start_date,
              due_date: due_date
            }}
        );

   
           // Respond with a success message or other appropriate response
           res.status(200).json({ message: 'Task successfully'});
       } catch (error) {
           console.error('Error updating task:', error);
   
           // Respond with an error message or handle the error appropriately
           res.status(500).json({ error: 'Internal Server Error' });
       } finally {
           // Close the MongoDB connection
           await client.close();
       }
   
  })

  user.post("/createTask", async (req, res) => {

    //console.log("updateEmployeeDetails entered");
    let id = req.body.userID;
    id = new ObjectId(id);
    let title = req.body.task.title;
    let desc = req.body.task.description;
    let priority = req.body.task.priority;
    let status = req.body.task.statusT;
    let tags = [req.body.task.tag1, req.body.task.tag2];
    let file = req.body.task.file;
    let start_date = req.body.task.start_date;
    let due_date = req.body.task.due_date;

    let task = {
        "title": title,
        "description": desc,
        "priority": priority,
        "status": status,
        "tags": tags,
        "file": file,
        "start_date": start_date,
        "due_date": due_date
    }

      
       // Connect to the MongoDB server
       const client = new MongoClient('mongodb://0.0.0.0:27017');
  
       try {
           await client.connect();
 
           // Access the 'task_management' database and 'employees' collection
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');

           await taskCollection.insertOne(task);

           //const lastTask = await taskCollection.find().sort({$natural: -1}).limit(1)
           const lastTask = await taskCollection.findOne({}, { sort: { $natural: -1 } });
           const lastTaskID = lastTask._id;
           console.log("last task id: ", lastTaskID);

           //await taskCollection.findOne({ _id: lastTask._id });



           if (Array.isArray(tags) && tags.includes("team")) {
                const teamCollection = database.collection('teams');
                await teamCollection.updateOne({ employees: id }, { $push: { tasks: lastTask._id } });
           }
           else{
                const employeeCollection = database.collection('employees');
                await employeeCollection.updateOne({ _id: id }, { $push: { tasks: lastTask._id } });
           }
   
           // Respond with a success message or other appropriate response
           res.status(200).json({ message: 'Task successfully'});
       } catch (error) {
           console.error('Error updating task:', error);
   
           // Respond with an error message or handle the error appropriately
           res.status(500).json({ error: 'Internal Server Error' });
       } finally {
           // Close the MongoDB connection
           await client.close();
       }
   
  })

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