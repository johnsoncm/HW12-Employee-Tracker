const mysql = require('mysql');
const inquirer = require('inquirer');

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
    //call function here to do next
})

