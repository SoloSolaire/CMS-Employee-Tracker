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

function viewAE() {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
};

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
            let addedRole = [ans.title, ans.salary, ans.department];

            db.query(`INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`, addedRole, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Role added!");
                init();
            })
        })
};

function addAE() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "First name of the employee?",
            name: "first"
        },
        {
            type: "input",
            message: "Last name of the employee?",
            name: "last"
        },
        {
            type: "input",
            message: "ID of the employee's role?",
            name: "roleID"
        },
        {
            type: "input",
            message: "ID pf the employee's manager?",
            name: "managerID"
        }
    ])
    .then((ans) => {
        let addedEmployee = [ans.first, ans.last, ans.roleID, ans.managerID];

        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, addedEmployee, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("Employee added!");
            init();
        })
    })
};

function updateAE() {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, results) => {
        if (err) {
            console.log(err);
        }

        inquirer
        .prompt([
            {
                type: "list",
                message: "Update which employee?",
                name: "employee",
                choices: results.map((nombre) => ({
                    name: `${nombre.last_name}, ${nombre.first_name}`,
                    value: nombre.id,
                })),
                
            }
        ])
        .then((ans) => {
            const employeeID = ans.employee;

            db.query(`SELECT id, title FROM role`, (err, results) => {
                if (err) {
                    console.log(err);
                }

                inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "Choose a new role for the selected employee",
                            name: "newRole",
                            choices: results.map((role) => ({
                                name: role.title,
                                value: role.id
                            }))
                        }
                    ])
                    .then((ans) => {
                        const newID = ans.newRole;

                        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [newID, employeeID], (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("Employee updated!");
                            init();
                        })
                    })
            })
        })
    });
};

