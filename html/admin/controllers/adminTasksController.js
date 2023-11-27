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

  user.post('/getTeamTasks', async (req, res) => {

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
  
        // const cursor = await usersCollection.find({ _id: uid }).toArray();
        // const taskIDs = cursor.map(doc => doc.tasks);
        

        // for (const taskID of taskIDs[0]) {
            
        //     const task = await taskCollection.findOne({ _id: taskID });
    
        //     // Add the employee details to the array
        //     tasksArray.push(task);
        // }

        
  
        const emp = await teamCollection.find({ admin: uid }).toArray();
        const taskIDs2 = emp.map(doc => doc.tasks);
        

        for (const taskID of taskIDs2[0]) {
            const task = await taskCollection.findOne({ _id: taskID });
    
            task.user = 'team';
            // Add the employee details to the array
            tasksArray.push(task);
        }

        if (emp.length > 0 && emp[0].employees) {
            const employeeIDs = emp[0].employees;
  
        
            for (const employeeID of employeeIDs) {
                const employee = await usersCollection.findOne({ _id: employeeID });

        
                if (employee && employee.tasks) {
                    const taskIDs = employee.tasks;

        
                    for (const taskID of taskIDs) {
                        const task = await taskCollection.findOne({ _id: taskID });

                        task.user = employee.email;

        
                        if (task) {
                            tasksArray.push(task);
                        }
                    }
                }
            }
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
    let tags = req.body.task.tags;
    let start_date = req.body.task.start_date;
    let due_date = req.body.task.due_date;

      
       // Connect to the MongoDB server
       const client = new MongoClient('mongodb://0.0.0.0:27017');
  
       try {
           await client.connect();
 
           // Access the 'task_management' database and 'employees' collection
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');
  
          await taskCollection.updateOne(
            { _id: id },
            {$set:{
              title: title,
              description: desc,
              priority: priority,
              status: status,
              file: file,
              tags: tags,
              start_date: start_date,
              due_date: due_date
            }}
        );

        //If tags contains "team"
        if (Array.isArray(tags) && tags.includes("team")) {
            console.log("Entered tags if");
                adminID = req.body.adminID;
                adminID = new ObjectId(adminID);

                const usersCollection = database.collection('employees');
                const teamCollection = database.collection('teams');

                //get user for that task
                const user = await usersCollection.findOne({tasks: id});
                let userID = user._id;
                userID = new ObjectId(userID);
                console.log('User id: ', userID);

                //Check that task isn't already in team
                const task = await teamCollection.findOne({ tasks: id });
                if(!task)
                {
                    //Take task from employee and add to team.
                    
                    const result = await usersCollection.updateOne({_id: userID},{$pull:{ tasks: id }});
                    await teamCollection.updateOne({admin: adminID},{$push:{ tasks: id }});
                }

                
        }
        else
            console.log("NOT ENTERED THERE");
   
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

  user.post("/setTaskPriority", async (req, res) => {

    //console.log("updateEmployeeDetails entered");
    let id = req.body.dbid;
    id = new ObjectId(id);
    let priority = req.body.priority;

      
       // Connect to the MongoDB server
       const client = new MongoClient('mongodb://0.0.0.0:27017');
  
       try {
           await client.connect();
 
           // Access the 'task_management' database and 'employees' collection
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');
  
          await taskCollection.updateOne(
            { _id: id },
            {$set:{
              priority: priority,
            }}
        );
        
           res.status(200).json({ message: 'Task priority successfully updated'});
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