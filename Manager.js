// class function

class Manager {
    constructor (id) {
        this.id = id
    }
    //functions to return info
    addSomething(){
        inquirer
        .prompt({
            name: 'add',
            type: 'list',
            message: 'What would you like to add?',
            choices: ['Department' , 'Roles' , 'Employees']
        })

    }

    viewSomething(){

    }

    updateSomething(){

    }

    deleteSomething(){

    }
}


module.exports = Manager;