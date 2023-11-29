# TechSpire Task Management System

## Overview

The TechSpire Task Management System is a web application developed for managing tasks within an imaginary company named TechSpire. This system is designed to streamline task assignment, tracking, and collaboration among employees and administrators.

## Technologies Used

- Node.js/Express: Backend server and API development.
- Alpine.js: Frontend JavaScript framework for creating dynamic user interfaces.
- MongoDB: Database for storing task-related information.
- HTML/CSS: Frontend markup and styling.
- JavaScript/jQuery: Additional frontend scripting.

## Database Structure

The data is organized into four main collections within the MongoDB database:

1. `tasks`: Information related to tasks, including priority, status, due date, attached files, and tags.
2. `employees`: Details about individual employees.
3. `admins`: Information about administrators, who own teams of employees.
4. `teams`: Details about teams.

## Functionality

### Admin Features

- Create and edit administrators.
- Create and edit employees.
- Assign and edit tasks to individual employees or entire teams.
- View notifications.
- Generate status reports for their respective teams.

### Employee Features

- View assigned tasks.
- Edit task status.
- View tasks in calendar view by due date.
- View notifications.
- Generate status reports for their tasks.

## Getting Started

To run the TechSpire Task Management System locally, follow these steps:

1. **Clone the repository.**

   Make sure you have the following installed:
   - [MongoDB](https://www.mongodb.com/try/download/community)
   - [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
   - [Mongo shell](https://www.mongodb.com/try/download/shell)

 
2. **Install dependencies using `npm install`**
   
    ```
    npm install node
    npm install express
    npm install bcrypt
    npm install multer
    npm install path
    npm install mongodb
    npm install body-parser
    ```
    
3. **Activating MongoDB**
   
    To boot up the Mongo server, find your mongoDB installation bin folder and run `mongosh`.
  
    For windows, the path will look something like this:

     ```
      C:\Program Files\MongoDB\Server\7.0\bin
     ```
     
    _Make sure to conect the database using MongoDBCompass and that the database and collections follow the structure_


    You can populate the database with the correct format by importing the JSON documents found in the folder `db_documents` in this GitHub repository.

  

5. **Run the server**
   
   To run the Node.js server use a tool that can host the project locally such as VSCode, go to the terminal and run the following command:
     
     ```
     node html/server.js
     ```
6. **Test the web application**
   
   Once both these servers are up and running, you may enter the site through `localhost:3000/admin/` or `localhost:3000/employee/` in your browser.
