//import parent class

const Manager = require('./Manager');

class Employee extends Manager {
    constructor (firstName, lastName, id, roleID, managerId){
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleId = roleID;
        this.managerId = managerId;
    }
    //functions to return Employee

}

module.exports = Employee;