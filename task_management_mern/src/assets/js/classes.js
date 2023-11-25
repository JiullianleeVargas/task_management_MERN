//Classes from which our cookies will be made of

class ADMIN {
    constructor(id, email, pass) {
        this.id = id;
        this.email = email;
        this.password = pass;
        this.userlist = [];
        this.notifications = [];
        this.status = 'active';
    }
}


class EMPLOYEE {
    constructor(id, email, pass) {
        this.id = id;
        this.email = email;
        this.password = pass;
        this.status = 'active';
        this.completed_tasks = [];
        this.notifications = [];
    }
}

class TASK {
    constructor(id, user, name, desc, date, priority)
    {
      this.taskID = id;
      this.task_user = user;
      this.task_name = name;
      this.task_description = desc;
      this.due_date = date;
      this.task_status = 'Pending';
      this.task_priority = priority;
    }

}


//Functions for cookie handling
function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  function checkCookieExists(cookieName) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      if (cookie.startsWith(cookieName + '=')) {
        return true; 
      }
    }
    return false;
  }

function setCookie(name, value) {
  value = JSON.stringify(value);
    document.cookie = name + '=' + value + ';path=/';
}

function getAdminIdByUserId(admins, userID) {
  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i];
    if (admin.userlist.includes(userID)) {
      return admin.id;
    }
  }
  return null;
}