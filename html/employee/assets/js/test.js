"use strict";

//redirect to login if logging out
function logout(evt) {
    evt.preventDefault();
    sessionStorage.clear();
    window.location.href = "login.html";

};

$(document).ready( () => {

    //initialize cookies if lost or not found

    if(!checkCookieExists("admins"))
    {
        
    //     const admin1 = new ADMIN(1, "javier.quinones3@upr.edu", "pass1234");
    //     const admin2 = new ADMIN(2, "natasha.ramos8@upr.edu", "enterpass");
    //     admin1.notifications.push("Elena has finished a task!");

    //     var admins = [admin1, admin2];
    //     admins[0]['userlist'].push(1);
    //     admins[1]['userlist'].push(2);

    // setCookie("admins", admins);
    }
    


    if(!checkCookieExists("users"))
    {
        // const user1 = new EMPLOYEE(1, "ernesto@gmail.com", "ernestin");
        // const user2 = new EMPLOYEE(2, "elenagomez@gmail.com", "passelena");

        // var users = [user1, user2];


        // setCookie("users", users);
    }

    if(!checkCookieExists("tasks"))
    {
        // const task1 = new TASK(1, 2, "Create a website", "Create a riveting website that will change the world", "2023-11-10", "medium"); 
        // const task2 = new TASK(1, 1, "Get the admin a coffee", "Get your favorite administrator a hot black coffee", "2023-10-17", "high");
        // const task3 = new TASK(2, 2, "Take your vitamins", "Do not forget to drink all your healthy vitamins every morning", "2023-10-15", "low");
        // const task4 = new TASK(3, 2, "Take your dog off the lawn", "Do not forget to drink all your healthy vitamins every morning", "2023-10-15", "low");
        // const task5 = new TASK(2, 1, "Do your homework", "Do not forget to drink all your healthy vitamins every morning", "2023-10-15", "low");

        // var tasks = [task1, task2, task3, task4, task5];


        // setCookie("tasks", tasks)
    }

    //Go to logout function if clicked on log out button
    $("#logoutbtn").click(logout);

});







