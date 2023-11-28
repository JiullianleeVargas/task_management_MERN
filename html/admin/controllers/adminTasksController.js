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

        console.log("TASKS: ", tasksArray);

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
    const client = new MongoClient('mongodb://0.0.0.0:27017');
  
    try {
        const tasksArray = [];
        
        await client.connect();
        const database = client.db('task_management');
        const usersCollection = database.collection('employees');
        const taskCollection = database.collection('tasks');
        const teamCollection = database.collection('teams');        
  
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

        res.json({tasks: tasksArray});
        
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
  });


  user.post("/updateTask", async (req, res) => {

    let id = req.body.task.dbid;
    id = new ObjectId(id);
    console.log("TASK ID: ", id);
    let adminID = req.body.adminID;
    adminID = new ObjectId(adminID);  
    let key;
    if(req.body.key)
        key = req.body.key;
    let userID;
    if(req.body.userID);
        userID = req.body.userID;
        userID = new ObjectId(userID);
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
           const usersCollection = database.collection('employees');
           const teamCollection = database.collection('teams');

           if(!key)
           {
                userTemp = await usersCollection.findOne({_id: userID});
                key = userTemp.email;
           }

         //Update task for a single employee (no team)
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
                              

                //Check that task isn't already in team
                var team = await teamCollection.findOne({ tasks: id });
                if(!team)
                {
                    //Take task from employee and add to team.

                    const user = await usersCollection.findOne({tasks: id});
                    let userID = user._id;
                    userID = new ObjectId(userID);
                    
                    const result = await usersCollection.updateOne({_id: userID},{$pull:{ tasks: id }});
                    await teamCollection.updateOne({admin: adminID},{$push:{ tasks: id }});
                }

                //Get task again just in case it just added above
                var team = await teamCollection.findOne({ tasks: id });

                //Get employee IDs from team
                const teamEmployees = team.employees;

                //For each employee, add to their notifications the changes made to task
                for(const employee of teamEmployees)
                {
                    var e_id = new ObjectId(employee);

                    var string = `The task "${title}" was updated!`;

                    await usersCollection.updateOne( 
                            { _id: e_id },
                            {
                                $push: { notifications: string },
                            },
                    );
                }  
            }
        else if(key == 'team')
        {
            //if not previously in team:
            const team = await teamCollection.findOne({tasks: id});
            if(!team)
            {       
                 //find the user
                 const tempUser = await usersCollection.findOne({tasks: id});

                //Remove that task from tasks array
                await usersCollection.updateOne(
                {_id: tempUser._id},
                { $pull: { "tasks": id } }
                );

                //add task to team
                await teamCollection.updateOne(
                    {"admin": adminID},
                    { $push: { "tasks": id } }
                    );

                //notify each member in team (task was moved to team)
                let team = await teamCollection.findOne({"admin": adminID});

                let string = `The task "${title}" was re-assigned to the team.`;

                for(employeeID of team.employees)
                {
                    await usersCollection.updateOne({_id: employeeID}, {$push:{notifications: string}});
                }
            }
            else //task already in team
            {
                let string = `The task "${title}" was updated.`;

                for(employeeID of team.employees)
                {
                    await usersCollection.updateOne({_id: employeeID}, {$push:{notifications: string}});
                }
            }
            
        }
        else //if set to a user
        {
            //find the old user for the task
            const oldUser = await usersCollection.findOne({tasks: id});

            
            if(oldUser)
            {
                //check if user is same or not
                if(oldUser.email == key)
                {
                    let userID = new ObjectId(oldUser._id);
                    var string = `The task "${title}" was updated!`;
                    await usersCollection.updateOne( 
                            { _id: userID },
                            {
                                $push: { notifications: string },
                            },
                    );
                }
                //if user changed:
                else{

                    //remove task from old user
                    await usersCollection.updateOne(
                        {_id: oldUser._id},
                        { $pull: { "tasks": id } }
                        );

                    //notify them of removal
                    var string = `The task "${title}" was assigned to a new employee!`;
                    await usersCollection.updateOne( 
                            { _id: oldUser._id },
                            {
                                $push: { notifications: string },
                            },
                    );

                    //add task to new user
                    await usersCollection.updateOne( 
                        { email: key },
                        {
                            $push: { tasks: id },
                        },
                    );

                    //notify them of addition
                    var string = `The task "${title}" was added!`;
                    await usersCollection.updateOne( 
                            { email: key},
                            {
                                $push: { notifications: string },
                            },
                    );
                    
                }
            }

            //Task was not in employees, so it is a team task
            else
            {
                //remove task from team
                await teamCollection.updateOne(
                    {admin: adminID},
                    { $pull: { "tasks": id } }
                    );

                //notify each member of removal
                let theTeam = await teamCollection.findOne({admin: adminID});
                let string = `The task "${title}" was re-assigned to a single employee.`;

                for(employeeID of theTeam.employees)
                {
                    await usersCollection.updateOne(
                        {_id: employeeID},
                        { $push: { notifications: string } }
                        );
                }

                //add task to user
                await usersCollection.updateOne(
                    {email: key},
                    { $push: { tasks: id } }
                    );

                //notify user that task was moved to only their account
                let string2 = `The task ${title} was re-assigned to your account.`;
                await usersCollection.updateOne(
                    {email: key},
                    { $push: { notifications: string2 } }
                    );
            }
                
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
           const teamCollection = database.collection('teams');
           const usersCollection = database.collection('employees');

           let task = await taskCollection.findOne({_id: id});
  
          await taskCollection.updateOne(
            { _id: id },
            {$set:{
              priority: priority,
            }}
        );

            //notify employee or team

            const user = await usersCollection.findOne({tasks: id});
            const team = await teamCollection.findOne({tasks: id});

            let string = `The task "${task.title}" was changed to priority: ${priority}`;

            if(user)
            {
                await usersCollection.updateOne({tasks: id},
                {$push: {notifications: string}})
            }
            else
            {
                for(employeeID of team.employees)
                {
                    await usersCollection.updateOne({_id: employeeID},
                    {$push: {notifications: string}})
                }
            }


        
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

    let key = req.body.userkey;

    //Receive other parameters
    let adminID = req.body.adminID;
    adminID = new ObjectId(adminID);
    let title = req.body.task.title;
    let desc = req.body.task.description;
    let priority = req.body.task.priority;
    let status = req.body.task.statusT;
    let tags = [req.body.task.tag1, req.body.task.tag2];
    let file = req.body.task.file;
    let start_date = req.body.task.start_date;
    let due_date = req.body.task.due_date;

    //Create task JSON
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
 
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');
           const employeeCollection = database.collection('employees');

           //Insert the task into 'tasks' collection
           await taskCollection.insertOne(task);

           //Find that newly inserted task
           const lastTask = await taskCollection.findOne({}, { sort: { $natural: -1 } });

           //Check if tags includes 'teams'
           if(key !== 'team')
           {
                
                let tempUser = await employeeCollection.findOne({email: key});
                let id = tempUser._id;
                if (Array.isArray(tags) && tags.includes("team")) {
                        //Add the task ID onto the team
                        const teamCollection = database.collection('teams');
                        await teamCollection.updateOne({ employees: id }, { $push: { tasks: lastTask._id } });

                        //Add to employees of team notification of new task
                        const team = teamCollection.findOne({employees: id});

                        string = `The task "${title}" was added!`;

                        for(employee of team.employees)
                        {
                            await employeeCollection.updateOne({ _id: employee }, { $push: { notifications: string } });
                        }
                }
                else{
                        //If a single employee, add task ID onto tasks array
                        
                        await employeeCollection.updateOne({ _id: id }, { $push: { tasks: lastTask._id } });

                        //Add notification of new task to single employee
                        const user = employeeCollection.findOne({_id: id});
                        string = `The task "${title}" was added!`;
                        await employeeCollection.updateOne({ _id: id }, { $push: { notifications: string } });
                }
            }

            //If tags doesn't have team but you set the task user to be the whole team anyway
            else
            {
                const teamCollection = database.collection('teams');
                await teamCollection.updateOne({ admin: adminID }, { $push: { tasks: lastTask._id } });

                //Add to employees of team notification of new task
                const team = await teamCollection.findOne({admin: adminID});

                console.log("TEAM: ", team);

                string = `The task "${title}" was added!`;

                for(employee of team.employees)
                {
                    await employeeCollection.updateOne({ _id: employee }, { $push: { notifications: string } });
                }
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

  user.post("/createEmployeeTask", async (req, res) => {

    //Get Employee ID and convert to ObjectID for Mongo
    
    id = req.body.userID;
    id = new ObjectId(id);

    //Receive other parameters
    let adminID = req.body.adminID;
    adminID = new ObjectId(adminID);
    let title = req.body.task.title;
    let desc = req.body.task.description;
    let priority = req.body.task.priority;
    let status = req.body.task.statusT;
    let tags = [req.body.task.tag1, req.body.task.tag2];
    let file = req.body.task.file;
    let start_date = req.body.task.start_date;
    let due_date = req.body.task.due_date;

    //Create task JSON
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
 
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');
           const employeeCollection = database.collection('employees');

           //Insert the task into 'tasks' collection
           await taskCollection.insertOne(task);

           //Find that newly inserted task
           const lastTask = await taskCollection.findOne({}, { sort: { $natural: -1 } });

           //Check if tags includes 'teams'  
            if (Array.isArray(tags) && tags.includes("team")) {
                    //Add the task ID onto the team
                    const teamCollection = database.collection('teams');
                    await teamCollection.updateOne({ employees: id }, { $push: { tasks: lastTask._id } });

                    //Add to employees of team notification of new task
                    const team = teamCollection.findOne({employees: id});

                    string = `The task "${title}" was added!`;

                    for(employee of team.employees)
                    {
                        await employeeCollection.updateOne({ _id: employee }, { $push: { notifications: string } });
                    }
            }
            else{
                    //If a single employee, add task ID onto tasks array
                    
                    await employeeCollection.updateOne({ _id: id }, { $push: { tasks: lastTask._id } });

                    //Add notification of new task to single employee
                    const user = employeeCollection.findOne({_id: id});
                    string = `The task "${title}" was added!`;
                    await employeeCollection.updateOne({ _id: id }, { $push: { notifications: string } });
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

  user.post("/deleteTask", async (req, res) => {

    
    let taskID = req.body.task.dbid;
    taskID = new ObjectId(taskID);
    let title = req.body.task.title;

      
       // Connect to the MongoDB server
       const client = new MongoClient('mongodb://0.0.0.0:27017');
  
       try {
           await client.connect();
 
           const database = client.db('task_management');
           const taskCollection = database.collection('tasks');
           const employeeCollection = database.collection('employees');
           const teamCollection = database.collection('teams');

           //delete the task

           await taskCollection.deleteOne({_id: taskID});

           //find task in employees
           let user = await employeeCollection.findOne({tasks: taskID});
           let string = `The task "${title}" was removed.`;
           if(user)
           {
                //delete task ref from tasks array
                await employeeCollection.updateOne({_id: user._id},
                    {$pull:{tasks: taskID}})

                //add notification of deletion
                await employeeCollection.updateOne({_id: user._id},
                    {$push:{notifications: string}})
           }
           else
           {
                //if employee not found, find team
                let team = await teamCollection.findOne({tasks: taskID});

                //delete task ref from tasks array
                await teamCollection.updateOne({_id: team._id},
                    {$pull:{tasks: taskID}})

                //for each employee in team, notify of deletion
                for(employeeID of team.employees)
                {
                    await employeeCollection.updateOne({_id: employeeID},
                        {$push:{notifications: string}})
                }

                
           }

          
           // Respond with a success message or other appropriate response
           res.status(200).json({ message: 'Task successfully deleted'});
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