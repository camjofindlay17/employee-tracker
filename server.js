const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('table')
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
  
    port: 3306,
  
    user: process.env.DB_USER,
  
    // Be sure to update with your own MySQL password!
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }); 

  connection.connect((err) => {
    if (err) throw err;
    start()
  });


  const start = () => {
      inquirer.prompt ({
          name: 'action',
          type: 'rawlist',
          message: 'What would you like to do?',
          choices: [
            'View All Employees',
            'View all Employees By Department',
            'View All Employees By Manager',
            'Add Department',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'Add Role',
            'Remove Role'
          ],
      })
      .then ((answer) => {
          switch (answer.action) {
              case 'View All Employees':
              showEmployees()
              break;
              case 'View all Employees By Department':
              employeesByDept()
              break;
              case 'View All Employees By Manager':
              showManager()
              break;
              case 'Add Department':
              addDepartment()
              break;
              case 'Add Employee':
              addEmployee();
              break;
              case 'Remove Employee':
              removeEmployee()
              break;
              case 'Update Employee Role':
              updateRole();
              break;
              case 'Update Employee Manager':
              //function to View employees by manager
              break;
              case 'View All Roles':
              showRole()
              break;
              case 'Add Role':
              addRole()
              break;
              case 'Remove Role':
              removeRole()
              break;
          }
      })
  }

  //Show All Employees
const showEmployees = () => {
    let sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, manager.last_name AS Manager_Last_Name FROM employee LEFT JOIN employee as manager on employee.manager_id = manager.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id';
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res)
        start()
    }) 
}

//Show individuals and their manager
const showManager = () => {
    sql = 'SELECT e.first_name as First, e.last_name as Last, m.first_name as Manager_First, m.last_name as Manager_Last from employee e JOIN employee m on e.manager_id = m.id'
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res)
        start()
})
}

//Show employees by department
const employeesByDept = () => {
    sql = 'SELECT department.id, department.department FROM department'
    connection.query(sql, (err, res) => {
        const dept = res.map(({department }) => ({name: department}))
        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "Select Department",
                choices: dept
            }
        ])
    .then(ans => {
        const depart = ans.dept
        console.log(ans.dept)
        const deptSql = `SELECT employee.first_name, employee.last_name, role.title, department.department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.department = '${depart}'`
        connection.query(deptSql, (err, res) => {
        if (err) throw err
        console.table(res)
        start()
    })
    })
})
}

//Add employee to employees database
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first',
            type: 'input',
            message: 'Please enter the employee first name'
        },
        {
            name: 'last',
            type: 'input',
            message: 'Please enter the employee last name'
        },
    ])
    .then (answer => {
        info = [answer.first, answer.last]
        const sql = 'SELECT role.id, role.title FROM role'
        connection.query(sql, (err, res) => {
        roleList = res.map(({ id, title }) => ({ name: title, value: id }))
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Select Employee role',
                choices: roleList
            }
        ])
        .then(ans => {
        role = ans.role
        info.push(role)
        const manSql = 'SELECT * FROM employee'
        connection.query(manSql, (err, res) => {
            const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }))
            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select Employee manager',
                    choices: managers
                }
            ])
        .then(ans => {
            man = ans.manager
            info.push(man)
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
            connection.query(sql, info, (err) => {
                if (err) throw err
                showEmployees()
            })
        })
        })
        })
        })
    })
}


//Remove employee from employees database
const removeEmployee = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', (err, res) => {
        if (err) throw err;
        const emp = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }))
    inquirer.prompt([
        {
            name: 'remove',
            type: 'rawlist',
            choices: emp,
            message: 'Please select employee'
        }
    ])
    .then ((ans) => {
        let del = ans.remove
        console.log(del)
        connection.query(`DELETE FROM employee WHERE id=${del}`, (err, res) => {
            if (err) throw err;
            console.log('Employee Removed!')
        })
    showEmployees()
    })
})
}

//Show employee roles
const showRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res)
        start()
    }) 
}

//Add role to the employee database
const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter new role'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter salary'
        },
    ])
    .then((ans) => {
        const info = [ans.title, ans.salary]
        const sql = 'SELECT * FROM department'
        connection.query(sql, (err, res) => {
            const dept = res.map(({ id, department }) => ({ name: department, value: id }))
            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'depart',
                    message: 'Select Department',
                    default: null,
                    choices: dept
                }
            ])
        .then(answer => {
            let d = answer.depart
            info.push(d)
            const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)'
            connection.query(sql, info, (err) => {
                if (err) throw err
                console.log("Role Added!")
                start()
            })
        })
        })
    })
}

//Remove role from employee database
const removeRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
    inquirer.prompt([
        {
            name: 'rem',
            type: 'rawlist',
            choices() {
                const choiceArray = [];
                res.forEach(({title}) => {
                  choiceArray.push(`${title}`);
                });
                return choiceArray;
              },
            message: 'Please select title to remove'
        }
    ])
    .then ((answer) => {
        rem = answer.rem
        connection.query('DELETE FROM role WHERE title=?', [rem], function (err, res) {
            if (err) throw err;
            console.log('Role Removed!')
            start()
        })
    })
})
}


//Add department to employeees database
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter new Deparment'
        },
    ])
    .then((answer) => {
        connection.query(
        'INSERT INTO department SET ?',
        {
          department: `${answer.name}`,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`${answer.name} Added!`)
            start()
        })
    })
}