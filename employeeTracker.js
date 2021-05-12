// import dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');
const Manager = require('./Manager');
console.log("test" , Manager);
const cTable = require('console.table');
let departments = [];
let managers;
let employees;
let roles;

//connect to server
const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306, 

    user: 'root',

    password: 'Bocephus1!',
    database: 'employee_trackerDB',

});
connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected as ${connection.threadId}`);
   start();
 
});

//cool title graphics
figlet(`Employee Tracker` , (err, result) => {
    console.log(err || result);
});


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
        }else if (answer.add === 'Employee'){
            console.log('Add a new ' + answer.add);
            addEmployee();
        }else if (answer.add === 'Exit') {
            figlet('Goodbye!',(err, result) =>{
                console.log(err || result)
            });
                connection,end();
        }else {
            connection.end();
        }
    })
}

addEmployee = () => {
    // getRoles();
    // getManagers();
    // let roleOptions = [];
    // for (i = 0; i < roles.length; i++) {
    //     roleOptions.push(Object(roles[i]));
    // };
    // let managerOptions = [];
    // for (i = 0; i < managers.length; i++) {
    //     managerOptions.push(Object(managers[i]));
    // };

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
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++){
                    choiceArray.push(roleOptions[i].title)
                }
                return choiceArray;
            }
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
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${answer.first_name} , ${answer.last_name}, ${answer.role_id}, ${answer.manager_id})` , (err, res) => {
            if (err) throw err;
            console.log('1 new employee added: ' + answer.first_name + "" + answer.last_name);
            // getEmployees();
            // start();
        }
    )
},  

// When add role option is chosen, the user is prompted to answer questions about the role
addRole = () =>{
    let departmentOptions = [];
    for (i = 0; i < departments.length; i++) {
        console.log("test");
        console.log("departments" ,departments)
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
            name: 'department_id',
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

        connection.query(`INSERT INTO employeeRole (role_title, salary, dept_id)); VALUES ('${answer.role_title}', '${answer.salary}', ${dept_id})`, (err, res) => {
            if (err) throw err;

            console.log('1 new rold added: ' + answer.title);
            getRoles();
            start();

        })
    })
},



getDepartments = () => {
    connection.query('SELECT id, dept_name FROM department', (err, res) => {
        if (err) throw err;
        departments = res;
        console.log(departments);
    })
},

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
},

//When  user chooses the 'View' option, they are gien the option to view dept, roles, employees, or exit
function viewSomething(){
    inquirer
    .prompt({
        name:'viewChoices',
        type: 'list',
        message: 'What would you like to view?',
        choices: ['Departments', 'Roles', 'Employees', 'Exit']

    })
},

//When user choose 'update' option they are prompted to choose what to update
function updateSomething(){
    inquirer
    .prompt({
        name: 'update',
        type: 'list',
        message: 'What would you like to update?',
        choices: ['Employee Roles', 'Employee Managers' , 'Exit']
    })
},
// when a use chooses to delete something, they are prompted to choose what to delete
function deleteSomething(){
    inquirer
    .prompt({
        name: 'delete',
        type: 'list',
        message: 'What would you like to delete?',
        choices: ['Delete Department', 'Delete Employee', 'Delete Role', 'Exit']
    });
})}

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