// import dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');
const Manager = require('./Manager');
const cTable = require('console.table');
let departments = [];
let managers;
let employees = [];
let roles;

//connect to server
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306, 

    user: 'root',

    password: 'Bocephus1!',
    database: 'employee_trackerDB',

});

//cool title graphics
figlet(`Employee Tracker` , (err, result) => {
    console.log(err || result);
});

connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected as ${connection.threadId}`);
   start();
   getDepartments();
   getRoles();
   getManagers();
   getEmployees();
 
});



// first question asking user if they want to add, view, update, or exit

function start() {
    inquirer
        .prompt({
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['ADD' , 'VIEW' , 'UPDATE' , 'EXIT']
        })
        .then(function(answer){
            if (answer.choices === 'ADD') {
                addSomething();
            }
            else if (answer.choices === 'VIEW') {
                viewSomething();
            }
            else if (answer.choices === 'UPDATE') {
                updateSomething();
            }
            else if (answer.choices === 'DELETE') {
                deleteSomething();
            }
            else if (answer.choices === 'EXIT') {
                figlet(`Goodbye!` , (err, result) => {
                    console.log(err || result);
                });
                connection.end();
            }
            else {
                connection.end();
            }
        })
    }

//function to get roles from mysql to use in later functions for updating, viewing, and adding
    async function getRoles() {
  
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM roles" , (err, res) => {
            if (err) reject (err);
            // console.log("results from getRoles()", res);
            resolve (res);
      })
           
        })

          

}
    //**********Block of get functions to retrieve data from mysql**********/

    getDepartments = () => {
        connection.query('SELECT id, dept_name FROM department', (err, res) => {
            if (err) throw err;
            departments = res.map(department => (department.dept_name));
         })
    },
    
    getManagers = () => {
        connection.query("SELECT id, first_name, last_name , CONCAT_WS('' , first_name, last_name) AS managers FROM employee" , (err, res) => {
            if (err) throw err;
            managers = res;
        })
    }
    
    getEmployees = () => {
        connection.query("SELECT id, CONCAT_WS(' ' , first_name, last_name) AS Employee_Name from employee" , (err, res) => {
            if (err) throw err;
            employees = res;
        })
    };
    

// When 'add' option is chosen the user is given option to add dept, role, or employee
function addSomething() {
    inquirer
    .prompt([{
        name: 'add',
        type: 'list',
        message: 'What would you like to add?',
        choices: ['Department' , 'Roles' , 'Employee']
    }
    ]).then(function(answer) {
        if(answer.add === 'Department') {
            console.log('Add a new: ' + answer.add);
            addDepartment();
        }else if (answer.add === "Roles"){
            console.log('Add a new: ' + answer.add);
            addRole();
        }else if (answer.add === "Employee"){
            console.log('Add a new ' + answer.add);
            addEmployee();
        }else if (answer.add === 'Exit') {
            figlet('Goodbye!',(err, result) =>{
                console.log(err || result)
            });
                connection.end();
        }
        // else {
        //     connection.end();
        // }


    }
)
}

//When user chooses to add a dept. they are given prompts to enter more information
//then user entered data is inserted into the department table
addDepartment = () => {
    inquirer.prompt([
        {
            name: 'dept_name',
            type: 'input',
            message: 'what department would you like to add'
        }
    ]).then(function(answer){
        // console.log('answer2' ,answer)
        connection.query(`INSERT INTO department (dept_name) VALUES ('${answer.dept_name}')`, (err, res) => {
            if (err) throw err;
            console.log('1 new department added: ' + answer.dept_name);
            // console.log('answer' , answer);
            getDepartments();
            start();         

        })
 
    })
}


 // When add role option is chosen, the user is prompted to answer questions about the role
 addRole = () =>{
    let departmentOptions = [];
    for (i = 0; i < departments.length; i++) {
       
        
        departmentOptions.push(Object(departments[i]));
    }
    // console.log('department options' , departmentOptions);

    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What role would you like to add?'

        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary requirement for this position?'
        },
        {
            name: 'dept_id',
            type: 'list',
            message: 'What is the department for this position?',
            choices: departmentOptions
            

        },
  //The user input data is then inserted into the roles table
    ]).then(function(answer){
        for (i = 0; i < departmentOptions.length; i++) {
            if (departmentOptions[i].name === answer.department_id){
                department_id = departmentOptions[i].id
            }
        }

        connection.query(`INSERT INTO roles (role_title, salary) VALUES ('${answer.title}', '${answer.salary}')`, (err, res) => {
            if (err) throw err;

            console.log('1 new role added: ' + answer.title);
            getRoles();
            start();

        })
    })
}





  async function addEmployee() {
      
    const allRoles = await getRoles();


    let roleOptions = [];
    for (i = 0; i < allRoles.length; i++) {
        // console.log('all roles' , allRoles[i].role_title);
        roleOptions.push(allRoles[i].role_title);
        
        
        
    };

  
    // console.log("role options" , roleOptions);
    let managerOptions = [];
    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
    };
  
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"

        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"

        },
        {
            name: "role_id",
            type: "list",
            message: "What is the role for this employee?",
            choices: roleOptions

    
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < managerOptions.length; i++){
                    choiceArray.push(managerOptions[i].managers)
                }
                return choiceArray;
            }

        }
    ]).then(function(answer) {
        for (var i = 0; i < roleOptions.length; i++){
            if (roleOptions[i].title === answer.role_id) {
                role_id = roleOptions[i].id
            }
        }

        for(var i = 0; i < managerOptions.length; i++){
            if(managerOptions[i].managers === answer.manager_id){
                manager_id = managerOptions[i].id
            }
        }
        connection.query(`INSERT INTO employee (first_name, last_name, manager_id) VALUES ('${answer.first_name}' , '${answer.last_name}',  '${answer.manager_id}')` , (err, res) => {
            if (err) throw err;
            console.log('1 new employee added: ' + answer.first_name + " " + answer.last_name);
            getEmployees();
            start();
        })
    })
    };


    //****Block of view functions to view departments, roles, and employees****/

     viewSomething = () => {
        inquirer
        .prompt([
            {
            name:'viewChoice',
            type: 'list',
            message: 'What would you like to view?',
            choices: ['Departments', 'Roles', 'Employees', 'Exit']
    
        }
        ]).then(answer => {
        
        if (answer.viewChoice === "Departments") {
           return viewDepartments();
        }
        else if (answer.viewChoice === "Roles") {
           return viewRoles();
        }
        else if(answer.viewChoice === "Employees"){
           return viewEmployees();
        }
        else if(answer.viewChoice === "Exit"){
         return   figlet('Goodbye!' , (err, result) => {
                console.log(err || result);
                connection.end();
            })
        }else {
            connection.end();
        }

    })
};


//When  user chooses the 'View' option, they are gien the option to view dept, roles, employees, or exit


viewDepartments = () =>{
    connection.query("SELECT * FROM department" , (err, res) => {
        if (err) throw err;
        // console.log(err || res)

        console.table(res);
        start();
    });

   

}

viewRoles = () => {
    connection.query("SELECT * FROM roles" , (err, res) => {
        if (err) throw err;
        // console.log("hello" ,err || res);

        console.table(res);
        // console.log("results", res);
        start();
    });

   
}
// }

viewEmployees = () => {
    connection.query("SELECT * FROM employee" , (err, res) => {
        if (err) throw err;
        // console.log("results" , res);
        // console.log("test" , err || res);
        console.table(res);
    start();
    });
    
};


//When user choose 'update' option they are prompted to choose what to update
function updateSomething(){
    inquirer
    .prompt([{
        name: 'update',
        type: 'list',
        message: 'What would you like to update?',
        choices: ['Employee Roles', 'Exit']
    }
]).then(answer => {
    if (answer.update === "Employee Roles") {
        updateEmployeeRole();
    }else if (answer.update === "Employee Managers"){
        updateEmployeeManager();
    }else if(answer.update === "Exit"){
        figlet("Goodbye!" , (err, result) => {
            console.log(err || result);
        });
        connection.end();
    }else{
        connection.end();
    }
})
}


const pickEmployeeUpdate = async () =>{
  let employeeOptions = employees;
    return  inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: function () {
                var choiceArray = [];
                for(var i = 0; i < employeeOptions.length; i++){
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            }
        }
    ])
    
 
}
const pickNewEmployeeRole = async () => {
    const roleOptions = await getRoles();
    // console.log('role options', roleOptions)
 return inquirer.prompt ([
        {
            name: "newRole",
            type: "list",
            message: "Select new role:",
            // choices: roleOptions,
            choices: function (){
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++){
                    choiceArray.push(roleOptions[i].role_title)
                }
                return choiceArray;
            }

        }
        ])
}

const updateEmployeeRole = async () => {
    let employeeOptions = [];
const employeeToUpdate = await pickEmployeeUpdate();
const newRole = await pickNewEmployeeRole();
// console.log("employee to update", employeeToUpdate);
// console.log("get new roles", newRole);
// console.log("new role" , newRole.newRole);
    // query using this date ^

    connection.query(`UPDATE employee SET role_id = "${newRole.newRole}" WHERE id = "${employeeToUpdate.updateRole}"`); (err, res) =>{


                if (err) throw err;
               
            

    };
    console.log('New role updated!');
    start();

}


   
   


