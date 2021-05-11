const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306, 

    user: 'root',

    password: 'Bocephus1!',
    database: 'employee_trackerDB',

});

figlet(`Employee Tracker` , (err, result) => {
    console.log(err || result);
});

connection.connect((err) =>{
    if (err) throw err;
    console.log(`connected as ${connection.threadId}`);
    //call function here to do next
})

inquirer

