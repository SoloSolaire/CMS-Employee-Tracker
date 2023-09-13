const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PW,
    database: 'emp_db'
});

db.connect(function (err) {
    if (err) throw err;
    console.log('Welcome :)');
    init()
});

function init() {
    inquirer
        .prompt([
            {
                name: "mainmenu",
                type: "list",
                message: "Please choose an option",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add A Department",
                    "Add A Role",
                    "Add An Employee",
                    "Update An Employee",
                    "Exit"
                ]
            }
        ])
        .then((ans) => {
            switch (ans.mainmenu) {
                case "View All Departments": viewAD();
                break;

                case "View All Roles": viewAR();
                break;

                case "View All Employees": viewAE();
                break;

                case "Add A Department": addAD();
                break;

                case "Add A Role": addAR();
                break;

                case "Add An Employee": addAE();
                break;

                case "Update An Employee": updateAE();
                break;

                case "Exit": console.log("Aloha");
                db.end();
                break;
            }
        })
};

function viewAD() {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
};

function viewAR() {
    db.query(`SELECT * FROM role`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
};

function viewAE() {};

function addAD() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the name of the Department.",
                name: "depName"
            }
        ])
        .then((ans) => {
            db.query(`INSERT INTO department(name) VALUES (?)`, ans.depName, (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('Department added!');
                init();
            })
        })
};

function addAR() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Title of the role?",
                name: "title"
            },
            {
                type: "input",
                message: "Salary of the role?",
                name: "salary"
            },
            {
                type: "input",
                message: "ID of the department that the role is associated to?",
                name: "department"
            }
        ])
        .then((ans) => {
            let addedRole = [ans.title, ans.salary, ans.department]
            db.query(`INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`, addedRole, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Role added!");
                init();
            })
        })
};

function addAE() {};

function updateAE() {};

