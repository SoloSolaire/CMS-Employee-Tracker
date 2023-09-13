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

function viewAD() {};

function viewAR() {};

function viewAE() {};

function addAD() {};

function addAR() {};

function addAE() {};

function updateAE() {};

