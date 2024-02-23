// index.js

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Whee6780',
  database: 'employee_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to start the application
async function startApp() {
    try {
      // Display main menu and wait for user input
      const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          // Add additional options here for bonus features
          'Exit'
        ]
      });
  
      // Perform action based on user input
      switch (action) {
        case 'View all departments':
          await viewAllDepartments();
          break;
        case 'View all roles':
          await viewAllRoles();
          break;
        case 'View all employees':
          await viewAllEmployees();
          break;
        case 'Add a department':
          await addDepartment();
          break;
        case 'Add a role':
          await addRole();
          break;
        case 'Add an employee':
          await addEmployee();
          break;
        case 'Update an employee role':
          await updateEmployeeRole();
          break;
        // Add cases for additional options here
        case 'Exit':
          console.log('Exiting application...');
          process.exit();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

// Function to view all departments
async function viewAllDepartments() {
  const [rows] = await pool.query('SELECT * FROM department');
  console.table(rows);
  startApp(); // Restart the application
}

// Function to view all roles
async function viewAllRoles() {
  const [rows] = await pool.query('SELECT * FROM role');
  console.table(rows);
  startApp(); // Restart the application
}

// Function to view all employees
async function viewAllEmployees() {
  const [rows] = await pool.query('SELECT * FROM employee');
  console.table(rows);
  startApp(); // Restart the application
}

// Function to add a department
async function addDepartment() {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the department:'
  });

  await pool.query('INSERT INTO department (name) VALUES (?)', [name]);
  console.log('Department added successfully!');
  startApp(); // Restart the application
}

// Function to add a role
async function addRole() {
  // Prompt user for role information
  const roleInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for the role:'
    },
    {
      type: 'number',
      name: 'departmentId',
      message: 'Enter the department ID for the role:'
    }
  ]);

  // Insert role into the database
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
    roleInfo.title,
    roleInfo.salary,
    roleInfo.departmentId
  ]);

  console.log('Role added successfully!');
  startApp(); // Restart the application
}

// Function to add an employee
async function addEmployee() {
  // Get role choices
  const roles = await getAllRoles();
  const roleChoices = roles.map(role => ({
    name: role.title,
    value: role.id
  }));

  // Prompt user for employee information
  const employeeInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the employee\'s first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee\'s last name:'
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the employee\'s role:',
      choices: roleChoices
    },
    {
      type: 'number',
      name: 'managerId',
      message: 'Enter the employee\'s manager ID (if applicable):'
    }
  ]);

  // Insert employee into the database
  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
    employeeInfo.firstName,
    employeeInfo.lastName,
    employeeInfo.roleId,
    employeeInfo.managerId || null
  ]);

  console.log('Employee added successfully!');
  startApp(); // Restart the application
}

// Function to update an employee role
async function updateEmployeeRole() {
  // Get employee choices
  const employees = await getAllEmployees();
  const employeeChoices = employees.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  // Get role choices
  const roles = await getAllRoles();
  const roleChoices = roles.map(role => ({
    name: role.title,
    value: role.id
  }));

  // Prompt user to select an employee and new role
  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the employee\'s new role:',
      choices: roleChoices
    }
  ]);

  // Update employee role in the database
  await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);

  console.log('Employee role updated successfully!');
  startApp(); // Restart the application
}

// Function to fetch all roles
async function getAllRoles() {
  const [rows] = await pool.query('SELECT * FROM role');
  return rows;
}

// Function to fetch all employees
async function getAllEmployees() {
  const [rows] = await pool.query('SELECT * FROM employee');
  return rows;
}

// Call startApp function to start the application
startApp();