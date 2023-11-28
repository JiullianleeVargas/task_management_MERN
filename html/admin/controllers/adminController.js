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

async function hashPassword(password) {
  try {
      // Generate a salt
      const salt = await bcrypt.genSalt(saltRounds);

      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
  } catch (error) {
      throw error;
  }
}

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}


user.use(express.json());

user.get('/new-route', (req, res) => {
  //console.log('entered new route');
  //res.type('html').sendFile(path.join(__dirname, '..', 'test.html'));
  //console.log(path.join(__dirname, '..', 'admins2.html'));
  res.type('html').sendFile(path.join(__dirname, '..', 'accounts.html'));
})

//navbar routes
user.get('/admins', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'admins.html'));
})

user.get('/tasks', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'tasks.html'));
})

user.get('/employees', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'accounts.html'));
})

user.get('/reports', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'reports.html'));
})

user.get('/getEmployee', (req, res) => {
  console.log('getEmployee');
  res.type('html').sendFile(path.join(__dirname, '..', 'editaccount.html'));
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
      //let data = readFrom("data.json");

      //Connect to DB named 'task_management' and collection named 'users'
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('admins');
      console.log("DB connect");

      const admin = await usersCollection.findOne({ email });



      if(admin)
      {
          let result = comparePassword(String(password), String(admin['password']));
          if(result)
          {
            console.log("Succesful log in!");
            res.json({ redirect: '/admin/employees', cookie: admin._id.toString()});
          }
      }

      else {
        console.log("Username or password is incorrect");
      }

    }

})

user.get('/getAdmins', async (req, res) => {
  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('admins');
      console.log('DB connected');

      //get admins
      const admins = await usersCollection.find({}).toArray();

      res.json({ admins });
  } catch (error) {
      console.error('Error retrieving admins:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});

user.post('/createAdmin', async function(req, res) {

  let email = req.body.email;
  let password = req.body.password;
  let f_name = req.body.f_name;
  let l_name = req.body.l_name;
  email = email.trim();
  password = password.trim();
  f_name = f_name.trim();
  l_name = l_name.trim();

  if (!email || !password || !f_name || !l_name) {
      console.log("No email or password provided");
      res.status(400).json({ error: "Both email and password are required." });
  } else {
    const client = new MongoClient('mongodb://0.0.0.0:27017');
    try{

        await client.connect();
        const database = client.db('task_management');
        const usersCollection = database.collection('admins');
        console.log("DB connect");

        const employee = await usersCollection.findOne({ email });

        if(!employee)
        {
          console.log('no existe el email.');
          const adminToInsert = { "email": email, "password": password, "status":"active", "l_name": l_name, "f_name": f_name};
          console.log('data: ', adminToInsert);
          // Insert the data into the collection
          const result = await usersCollection.insertOne(adminToInsert);
          console.log(`Inserted ${result.insertedCount} document(s)`);
        }
        else {
          console.log("Email already exists");
        }
    } finally {
      // Close the MongoDB connection
      await client.close();
      console.log('Connection closed');
    }

  }

})


user.get('/editadmin:id', (req, res) => {
  const id = req.params.id;
  console.log("admin id:", id);
  res.sendFile(path.join(__dirname, '..', 'editadmin.html'));  
});

user.get('/getAdmin/:id', async (req, res) => {
  const id = req.params.id;

  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('admins');
      //console.log('DB connected');

      //get admins
      const admin = await usersCollection.find({_id: new ObjectId(id)}).toArray();
      res.json(admin);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});

user.post('/updateAdmin', async function(req, res) {

  let id = req.body.id;
  const adminData = {};
  adminData.email = req.body.email.trim();
  adminData.password = req.body.password.trim();
  adminData.f_name = req.body.f_name.trim();
  adminData.l_name = req.body.l_name.trim();
  adminData.status = req.body.status.trim();
  console.log("admindata: ", adminData);  
  adminID = adminID.trim();
  console.log("id: ", id);

  const client = new MongoClient('mongodb://0.0.0.0:27017');
  try{
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('admins');
      console.log("DB connect");
      const admin = await usersCollection.find({_id: new ObjectId(id)}).toArray();
      console.log("admin db:", admin);
      if(!admin)
      {
        return res.status(404).json({ error: 'User not found' });
      }
      else {
        //chaeck if optional fields exists
        await console.log("admin exists", admin);
        for (const field in adminData) {
          if (adminData.hasOwnProperty(field) && admin.hasOwnProperty(field)) {
              admin[field] = adminData[field].trim();
          }
        }

        // Update the user in the database
        const updatedAdmin = await usersCollection.updateOne({_id: new ObjectId(id)}, 
        { $set: {email: adminData.email, password: adminData.password, status: adminData.status, f_name: adminData.f_name, l_name: adminData.l_name} });

        if(updatedAdmin.modifiedCount > 0){
          console.log("updatedAdmin: ", adminData);
          res.json({adminData});
        }
      }
  } catch (error) {
    console.error('Error retrieving admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Connection closed');
  }
})

user.post('/getEmployeePage', (req, res) => {
  console.log('/getEmployeePage');
  res.json({ redirect: '/admin/getEmployee'});
})

user.post('/getEmployeeDetails', async (req, res) => {

  uid = req.body.id;
  uid = new ObjectId(uid);
  console.log("UID: ", uid);
  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('employees');

      //get admins
      const user = await usersCollection.findOne({ _id: uid });
      console.log('user found');
      console.log(user);

      res.json({ user: user });
  } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});

user.post('/getMessages', async (req, res) => {

  adminID = req.body.adminID;
  adminID = new ObjectId(adminID);
  console.log("UID: ", adminID);
  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const adminCollection = database.collection('admins');

      //get admins
      const admin = await adminCollection.findOne({ _id: adminID });
      console.log('user found');
      console.log(admin);

      res.json({ messages: admin.notifications });
  } catch (error) {
      console.error('Error retrieving admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});

user.post('/deleteMessage', async (req, res) => {

  adminID = req.body.adminID;
  adminID = new ObjectId(adminID);
  messageID = req.body.messageID;
  console.log("Message ID: ", messageID);
  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //connect to db
      await client.connect();
      const database = client.db('task_management');
      const adminCollection = database.collection('admins');


      //Unset the notification
      const { modifiedCount } = await adminCollection.updateOne(
        { "_id": adminID },
        { $unset: { [`notifications.${messageID}`]: 1 } }
     );
     //Remove that null field from notifications array
     await adminCollection.updateOne(
      { "_id": adminID },
      { $pull: { "notifications": null } }
    );
     res.status(200).json({ message: 'Notification deleted successfully' });

  } catch (error) {
      console.error('Error retrieving admin:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});


user.post('/createAdmin', async function(req, res) {

  let email = req.body.email;
  let password = req.body.password;
  email = email.trim();
  password = password.trim();

  if (!email || !password) {
      console.log("No email or password provided");
      res.status(400).json({ error: "Both email and password are required." });
  } else {
    const client = new MongoClient('mongodb://0.0.0.0:27017');
    try{

        await client.connect();
        const database = client.db('task_management');
        const usersCollection = database.collection('admins');
        console.log("DB connect");

        const employee = await usersCollection.findOne({ email });

        if(!employee)
        {
          console.log('no existe el email.');
          const adminToInsert = { "email": email, "password": password, "status":"active"};
          console.log('data: ', adminToInsert);
          // Insert the data into the collection
          const result = await usersCollection.insertOne(adminToInsert);
          console.log(`Inserted ${result.insertedCount} document(s)`);
        }
        else {
          console.log("Email already exists");
        }
    } finally {
      // Close the MongoDB connection
      await client.close();
      console.log('Connection closed');
    }

  }

})


user.post("/getEmployees", async (req, res) => {

      console.log("getEmployees entered");
      adminID = req.body.adminID;
      adminID = new ObjectId(adminID);
      console.log(adminID);

      const client = new MongoClient('mongodb://0.0.0.0:27017');

      await client.connect();
      const database = client.db('task_management');
      const usersCollection = database.collection('teams');
      console.log("DB connect");

      // Alternatively, if using a cursor
      const cursor = await usersCollection.find({ admin: adminID }).toArray();
      const employeeIDs = cursor.map(doc => doc.employees);
      const employeesArray = [];

      for (const employeeId of employeeIDs[0]) {
        //const employeeObjectId = new ObjectId(employeeId);
        const employeeCollection = database.collection('employees');
        const employee = await employeeCollection.findOne({ _id: employeeId });
  
        // Add the employee details to the array
        employeesArray.push(employee);
      }

      //console.log(employeesArray);

      res.json({employees: employeesArray});

})

user.post("/updateEmployeeDetails", async (req, res) => {

  console.log("updateEmployeeDetails entered");
  let id = req.body.id;
  id = new ObjectId(id);
  const email = req.body.email;
  const password = hashPassword(req.body.password);
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const status = req.body.status;
    
     // Connect to the MongoDB server
     const client = new MongoClient('mongodb://0.0.0.0:27017');

     try {
         await client.connect();

         const employee = {
          email: email,
          password: password,
          f_name: f_name,
          l_name: l_name,
          status: status,
        };
 
         // Access the 'task_management' database and 'employees' collection
         const database = client.db('task_management');
         const usersCollection = database.collection('employees');
 
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
            email: email,
            password: password,
            f_name: f_name,
            l_name: l_name,
            status: status,
          }}
      );


 
         // Respond with a success message or other appropriate response
         res.status(200).json({ message: 'Employee updated successfully'});
     } catch (error) {
         console.error('Error inserting employee:', error);
 
         // Respond with an error message or handle the error appropriately
         res.status(500).json({ error: 'Internal Server Error' });
     } finally {
         // Close the MongoDB connection
         await client.close();
     }
 
})

user.post("/createEmployee", async (req, res) => {

  console.log("getEmployees entered");
  const email = req.body.email;
  const password = hashPassword(req.body.password);
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const status = req.body.status;
    
     // Connect to the MongoDB server
     const client = new MongoClient('mongodb://0.0.0.0:27017');

     try {
         await client.connect();

         const employee = {
          email: email,
          password: password,
          f_name: f_name,
          l_name: l_name,
          status: status,
          tasks: [],
          notifications: []
        };
 
         // Access the 'task_management' database and 'employees' collection
         const database = client.db('task_management');
         const usersCollection = database.collection('employees');
         const teamCollection = database.collection('teams');
 
         // Insert the employee object into the collection
         const result = await usersCollection.insertOne(employee);
 
         const employee_db = await usersCollection.findOne({ email: employee.email });

        const eid = employee_db._id;

        //const cursor = await teamCollection.find({ admin: adminID }).toArray();

        const result2 = await teamCollection.updateOne(
          { admin: adminID },
          {
              $push: {
                  employees: eid,
              },
          }
      );


 
         // Respond with a success message or other appropriate response
         res.status(200).json({ message: 'Employee inserted successfully', id: eid });
     } catch (error) {
         console.error('Error inserting employee:', error);
 
         // Respond with an error message or handle the error appropriately
         res.status(500).json({ error: 'Internal Server Error' });
     } finally {
         // Close the MongoDB connection
         await client.close();
     }
 
})

user.post("/setStatus", async (req, res) => {

  console.log("/setStatus entered");
  const userID = new ObjectId(req.body.userID);
  console.log(userID);
  const status = req.body.status;
  console.log(status);
    
     // Connect to the MongoDB server
     const client = new MongoClient('mongodb://0.0.0.0:27017');

     try {
         await client.connect();
 
         // Access the 'task_management' database and 'employees' collection
         const database = client.db('task_management');
         const usersCollection = database.collection('employees');

         await usersCollection.updateOne(
          { _id: userID },
          {$set:
            {
              status: status
            }
         }
        );

        const employee_db = await usersCollection.findOne({ _id: userID });
        console.log(employee_db.status);
 
         // Respond with a success message or other appropriate response
         res.status(200).json({ message: 'Employee updated successfully'});
     } catch (error) {
         console.error('Error inserting employee:', error);
 
         // Respond with an error message or handle the error appropriately
         res.status(500).json({ error: 'Internal Server Error' });
     } finally {
         // Close the MongoDB connection
         await client.close();
     }
 
})



// user.get('/getTeam/:id', async (req, res) => {
//   const id = req.params.id;

//   const client = new MongoClient('mongodb://0.0.0.0:27017');

//   try {
//       //conncet to db
//       await client.connect();
//       const database = client.db('task_management');
//       const teamCollection = database.collection('teams');
//       const userCollection = database.collection('employees');
//       const tasksCollection = database.collection('tasks');
      
//       //get the team
//       const team = await teamCollection.find({admin: new ObjectId(id)}).toArray();
//       //console.log("team tasks" ,team);
      

//       //get the users info
//       let users = [];
//       for (const user of team[0].employees){
//         //console.log("user: ", user);
//         let userInfo = await userCollection.find({_id: user}).project({ _id: 1,email: 1, f_name: 1, l_name: 1, tasks: 1}).toArray();
//         //console.log("user from team: ", userInfo);
//         //get the tasks from the user
//         let tasks = [];
//         for (const task of userInfo[0].tasks){
//           let taskInfo = await tasksCollection.find({_id: task}).toArray();
//           console.log("employee task: ", taskInfo);
//           tasks.push(taskInfo[0]);  
//           //console.log("employee task: ", tasks);        
//         };
//         userInfo[0].tasks = tasks[0];
//         //console.log("user tasks: ", userInfo);
//         let employee = userInfo[0].email;
//         users.push(userInfo[0]);
        
//       };

//       const teamTasks = await tasksCollection.find({ _id: { $in: team[0].tasks } }, (err, tasks) => {
//         if (err) {
//           console.error(err);
//           // Handle the error
//         } else {
//           console.log('team tasks:', tasks);
//           // Handle the found users
//         }
//       }).toArray();

//       users.push(teamTasks[0]);

//       //console.log("team tasks: ", teamTasks);
//       console.log("all users: ", users);

//       res.json(users);
//   } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//       await client.close();
//   }
// });

user.get('/getTeamTasks/:id', async (req, res) => {
  const id = req.params.id;

  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const teamCollection = database.collection('teams');
      const userCollection = database.collection('employees');
      const tasksCollection = database.collection('tasks');
      
      //get the team
      const team = await teamCollection.find({admin: new ObjectId(id)}).toArray();
      //console.log("team tasks" ,team);
      

      //get the users info
      let tasks = [];
      for (const user of team[0].employees){
        //console.log("user: ", user);
        let userInfo = await userCollection.find({_id: user}).project({ _id: 1,email: 1, f_name: 1, l_name: 1, tasks: 1}).toArray();

        for (const task of userInfo[0].tasks){
          let taskInfo = await tasksCollection.find({_id: task}).toArray();
          //console.log("employee task: ", taskInfo);
          taskInfo[0].email = userInfo[0].email;
          taskInfo[0].f_name = userInfo[0].f_name;
          taskInfo[0].l_name = userInfo[0].l_name;
          tasks.push(taskInfo[0]);  
          //console.log("employee task: ", tasks);        
        };
        
      };

      const teamTasks = await tasksCollection.find({ _id: { $in: team[0].tasks } }, (err, tasks) => {
        if (err) {
          console.error(err);
          // Handle the error
        } else {
          console.log('team tasks:', tasks);
          // Handle the found users
        }
      }).toArray();
      console.log("all tasks: ", tasks);
      console.log("teamtaskss: ", teamTasks);

      tasks.push(...teamTasks);
      // for (const task of teamTasks) {
      //   tasks.push(task);
      // }

      //console.log("team tasks: ", teamTasks);
      console.log("all tasks: ", tasks);

      res.json(tasks);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});