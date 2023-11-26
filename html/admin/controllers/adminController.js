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
const cookieParser = require('cookie-parser');


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

// function setCookie(name, value) {
//   value = JSON.stringify(value);
//     document.cookie = name + '=' + value + ';path=/';
// }

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}


user.use(express.json());
user.use(cookieParser());

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

user.get('/accounts', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'accounts.html'));
})

user.get('/reports', (req, res) => {
  res.type('html').sendFile(path.join(__dirname, '..', 'reports.html'));
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
            console.log("Succesful log in! ", admin._id.toString());
            res.cookie('admin', admin._id.toString(), { httpOnly: false, sameSite: 'None' }).json({ auth : true });
            //res.json({ auth : true, cookie: admin._id.toString()});
          }
      }
      else {
        console.log("Username or password is incorrect");
        res.json({ auth : false })
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

user.post('/register', (req, res) => {
  try {

    let email = req.body.email;
    let password = req.body.password;



    email = email.trim();
    password = password.trim();

    if (email != "" && password != "") {
      const data = readFrom("data.json");
      const admins = data.admins;
      let adminExists = false;
      //let lastIndex = 0;

      for (let index in admins) {
        if (admins[index].email == email) {
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
      //const admins = await usersCollection.find({}).toArray();
      const admin = await usersCollection.find({_id: new ObjectId(id)}).toArray();
      //console.log("admin getAdmin:", admin);
      res.json(admin);
  } catch (error) {
      //console.error('Error retrieving admins:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});

user.post('/updateAdmin', async function(req, res) {

  let id = req.body.id;
  const adminData = {};
  adminData.email = req.body.email;
  adminData.password = req.body.password;
  adminData.status = req.body.status;
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
      //res.json({admin});
      if(!admin)
      {
        //console.log("not admin");
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
        const updatedAdmin = await usersCollection.updateOne({_id: new ObjectId(id)}, { $set: {email: adminData.email, password: adminData.password, status: adminData.status} });

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


user.get('/getTeam/:id', async (req, res) => {
  const id = req.params.id;

  const client = new MongoClient('mongodb://0.0.0.0:27017');

  try {
      //conncet to db
      await client.connect();
      const database = client.db('task_management');
      const teamCollection = database.collection('team');
      const userCollection = database.collection('employee');
      const tasksCollection = database.collection('task');
      
      //get the team
      const team = await teamCollection.find({admin: new ObjectId(id)}).toArray();
      // console.log("team tasks" ,team[0].tasks);
      

      //get the users info
      let users = {};
      for (const user of team[0].employees){
        //console.log("user: ", user);
        let userInfo = await userCollection.find({_id: user}).toArray();
        //console.log("user from team: ", userInfo);
        //get the tasks from the user
        let tasks = [];
        for (const task of userInfo[0].tasks){
          let taskInfo = await tasksCollection.find({_id: task}).toArray();
          tasks.push(taskInfo[0]);          
        };
        userInfo[0].tasks = tasks[0];
        //console.log("user tasks: ", userInfo);
        let employee = userInfo[0].email;
        users[employee] = userInfo[0];
        
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

      users['teamTasks'] = teamTasks[0];

      //console.log("team tasks: ", teamTasks);
      console.log("all users: ", users);

      res.json(users);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});