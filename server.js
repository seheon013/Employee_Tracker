var mysql = require("mysql2");
var inquirer = require("inquirer");
var consoleTable = require("console.table");


var db = mysql.createConnection({

  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "employee_db"
});


db.connect((err) => {
  if (err) throw err;

  run();
});

function run() {
    inquirer.prompt( {
        name: "startmenu",
        type: "list",
        message : "Select one of the following options.",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]
    }).then (response => {
        switch (response.startmenu){
            case "View All Employees":
                viewAll();
                break;
            case "Add Employee":
                addEmployees();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "View All Roles":
                viewRole();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewDepts();
                break;
            case "Add Department":
                addDept();
                break;
            case "Quit":
                break;
        }
    })
};

function viewAll() {
    db.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", 
      function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        run();
      }
    );
  };

var roleChoices = [];
var empChoices = [];
var deptChoices = [];

function lookuprole(){  

    db.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
        roleChoices.push(data[i].id + "-" + data[i].title)
    }
    })
}

function lookupEmployee(){  
    db.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            empChoices.push(data[i].id + "-" + data[i].first_name+" "+ data[i].last_name)
        }
    }) 
}

function lookupDepts(){
    db.query("SELECT * FROM department", function (err, data) {
if (err) throw err;
for (i = 0; i < data.length; i++) {
    deptChoices.push(data[i].id + "-" + data[i].name)
}
})
}

function addEmployees() {

lookuprole()
lookupEmployee()

inquirer.prompt([
{
    name: "firstname",
    type: "input",
    message: "What is the employee's first name?"
},

{
    name: "lastname",
    type: "input",
    message: "What is the employee's last name?"
},

{
    name: "role",
    type: "list",
    message: "What is the employee's role?",
    choices: roleChoices 
    },

    {
    name: "reportingTo",
    type: "list",
    message: "Who is the employee's manager?",
    choices: empChoices
    }

    ]).then(function(answer) {
    var getRoleId =answer.role.split("-")
    var getReportingToId=answer.reportingTo.split("-")
    var query = 
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
    db.query(query, function(err, res) {
    console.log(`new employee ${answer.firstname} ${answer.lastname} added!`)
    });
    run();
});
};

function updateEmployeeRole() {
    db.query('SELECT * FROM employee', function (err, result) {
      if (err) throw (err);
      inquirer
        .prompt([
          {
            name: "employeeName",
            type: "list",
    
            message: "Which employee's role is changing?",
            choices: function () {
              var employeeArray = [];
              result.forEach(result => {
                employeeArray.push(
                  result.last_name
                );
              })
              return employeeArray;
            }
          }
        ])
     
        .then(function (answer) {
          console.log(answer);
          const name = answer.employeeName;
        
          db.query("SELECT * FROM role", function (err, res) {
            inquirer
              .prompt([
                {
                  name: "role",
                  type: "list",
                  message: "What is their new role?",
                  choices: function () {
                    var roleArray = [];
                    res.forEach(res => {
                      roleArray.push(
                        res.title)
                    })
                    return roleArray;
                  }
                }
              ]).then(function (roleAnswer) {
                const role = roleAnswer.role;
                console.log(role);
                db.query('SELECT * FROM role WHERE title = ?', [role], function (err, res) {
                  if (err) throw (err);
                  let roleId = res[0].id;
     
                  let query = "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name]
          
                  db.query(query, values,
                    function (err, res, fields) {
                      console.log(`You have updated ${name}'s role to ${role}.`)
                    })
                  viewAll();
                })
              })
          })
        })
    })
};

function viewRole() {
    db.query(
"SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
function(err, result, fields) {
   if (err) throw err;
   console.table(result);
   run();
 }
); };

function addRole() {

lookuprole()
lookupEmployee()
lookupDepts()

inquirer.prompt([
{
  name: "role",
  type: "input",
  message: "Enter the role you would like to add:"
},

{
    name: "dept",
    type: "list",
    message: "In what department would you like to add this role?",
    choices: deptChoices
},

{
  name: "salary",
  type: "number",
  message: "Enter the role's salary:"
},

 ]).then(function(answer) {
   console.log(`${answer.role}`)
  var getDeptId =answer.dept.split("-")
  var query = 
  `INSERT INTO role (title, salary, department_id)
   VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
   db.query(query, function(err, res) {
    console.log(`<br>-----new role ${answer.role} added!------`)
  });
  run();
});
};

function viewDepts() {
    db.query("SELECT * FROM department", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        run();
      }
); };

function addDept() {

lookuprole()
lookupEmployee()
lookupDepts()

inquirer.prompt([
{
  name: "dept",
  type: "input",
  message: "Enter the department you would like to add:"
}
]).then(function(answer) {
  var query = 
  `INSERT INTO department (name)
   VALUES ('${answer.dept}')`;
   db.query(query, function(err, res) {
    console.log(`-------new department added: ${answer.dept}-------`)
  });
  run();
});
};

