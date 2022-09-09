const mysql = require('mysql2');
const express = require('express');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
    {host : 'localhost',
     user: 'root', 
     password: '1234',
     database: 'employee_db'
    },
)

function run() {
    inquirer.promt( {
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
}