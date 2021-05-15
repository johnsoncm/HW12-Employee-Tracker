// import dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');
const Manager = require('./Manager');
console.log("test" , Manager);
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


    function getRoles() {
        return connection.query('SELECT id, role_title FROM roles')
       
        

}
    
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
        choices: ['Department' , 'Roles' , 'Employees']
    }
    ]).then(function(answer) {
        if(answer.add === 'Department') {
            console.log('Add a new: ' + answer.add);
            addDepartment();
        }else if (answer.add === "Roles"){
            console.log('Add a new: ' + answer.add);
            addRole();
        }else if (answer.add === "Employees"){
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
addDepartment = () => {
    inquirer.prompt([
        {
            name: 'dept_name',
            type: 'input',
            message: 'what department would you like to add'
        }
    ]).then(function(answer){
        console.log('answer2' ,answer)
        connection.query(`INSERT INTO department (dept_name) VALUES ('${answer.dept_name}')`, (err, res) => {
            if (err) throw err;
            console.log('1 new department added: ' + answer.dept_name);
            console.log('answer' , answer);
            getDepartments();
            start();         

        })
        // .then(function(answer){
        //     connection.query(`INSERT ALL departments (dept_name) VALUES (${answer.dept_name})` , (err, res) => {
        //         if(err) throw err;

        //     })
        // })
        //query to database to get all departments then response is push to departments array
    })
}


 // When add role option is chosen, the user is prompted to answer questions about the role
 addRole = () =>{
    let departmentOptions = [];
    for (i = 0; i < departments.length; i++) {
       
        
        departmentOptions.push(Object(departments[i]));
    }
    console.log('department options' , departmentOptions);

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





  function addEmployee() {
    getRoles()
    .then(function(err, res){
        console.log("results", res)
       
    });
    getManagers();
    let roleOptions = [];
    for (i = 0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
        
    };
  
    console.log("role options" , roleOptions);
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

            // choices: function() {
            //     var choiceArray = [];
            //     for (var i = 0; i < roleOptions.length; i++){
            //         choiceArray.push(roleOptions[i].title)
            //     }
            //     return choiceArray;
            // }
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
        console.log(err || res)

        console.table(res);
        start();
    });

   

}

viewRoles = () => {
    connection.query("SELECT * FROM roles" , (err, res) => {
    // ("SELECT r.id, r.role_title, r.salary, r.dept_id AS dept_name FROM roles AS r INNER JOIN department AS d ON r.dept_id = d.id") , (err, res) =>{
        if (err) throw err;
        console.log("hello" ,err || res);

        console.table(res);
        console.log("results", res);
        start();
    });
console.log("hello");
   
}
// }

viewEmployees = () => {
    connection.query("SELECT * FROM employee" , (err, res) => {
    // ("SELECT e.id, e.first_name, e.last_name, d.dept_name AS department, r.role_title, r.salary, CONCAT_WS('' , m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN roles r ON e.role_id = r.id INNER JOIN department d ON r.dept_id = d.id ORDER BY e.id ASC" , (err, res)=>{
        if (err) throw err;
        // console.log("results" , res);
        // console.log("test" , err || res);
        console.table(res);
    start();
    });
    
};
// };

//When user choose 'update' option they are prompted to choose what to update
function updateSomething(){
    inquirer
    .prompt([{
        name: 'update',
        type: 'list',
        message: 'What would you like to update?',
        choices: ['Employee Roles', 'Employee Managers' , 'Exit']
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

updateEmployeeManager = () => {

}


updateEmployeeRole = () => {
    let employeeOptions = [];

    for(var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
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
    
    .then(answer => {
        let roleOptions =[];
        for (var i = 0; i < roles.length; i ++){
            roleOptions.push(Object(roles[i]));
        };
        

        for (var i = 0; i < employeeOptions.length; i++){
            employeeSelected = employeeOptions[i].id
        }
    
    },
    inquirer.prompt ([
        {
            name: "newRole",
            type: "list",
            message: "Select new role:",
            choices: function (){
                var choiceArray = [];
                let roleOptions =[];
                for (var i = 0; i < roleOptions.length; i++){
                    choiceArray.push(roleOptions[i].title)
                }
                return choiceArray;
            }

        }
    ]).then(answer => {
        for(var i = 0; i < roleOptions.length; i++){
            if(answer.newRole === roleOptions[i].title) {
                newChoice = roleOptions[i].id
                connection.query(`UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`) , (err, res) =>{
                    if (err) throw err;
                }
            }
        }
        console.log("Role has been updated!");
        getEmployees();
        getRoles();
        start();
    })
    
    )

}
// when a use chooses to delete something, they are prompted to choose what to delete
// function deleteSomething(){
//     inquirer
//     .prompt({
//         name: 'delete',
//         type: 'list',
//         message: 'What would you like to delete?',
//         choices: ['Delete Department', 'Delete Employee', 'Delete Role', 'Exit']
//     });
// }


   
   


