const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require("console.table");


const db = mysql.createConnection(
    {
     host : 'localhost',
     user: 'root', 
     password: '1234',
     database: 'employee_db'
    }
);

db.connect(function(err) {
    if (err) throw err;
  
    run();
  });

// Initialize the inquirer
function run() {
    inquirer.prompt( {
        name: "startmenu",
        type: "list",
        message : "Select one of the following options.",
        choices: [
            "View All Employees",
            "Edit Employee info",
            "View Role",
            "Edit Role",
            "View Department",
            "Edit Department"
        ]
    }).then (response => {
        switch (response.startmenu){
            case "View All Employees":
                viewEmployees();
                break;
            case "Edit Employee info":
                editEmployee();
                break;
            case "View Role":
                viewRole();
                break;
            case "Edit Role":
                editRole();
                break;
            case "View Department":
                viewDepartment();
                break;
            case "Edit Department":
                editDepartment();
                break;
        }
    })
};

function viewEmployees() {
    let query = "SELECT * FROM employee";
    db.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        run();
});
}
async function editEmployee() {
    pass
};

async function viewDepartment() {
    pass
};

async function editDepartment() {
    pass
};

async function viewRole() {
    pass
};

async function editRole() {
    pass
};


