// queries/employeeQueries.js

const pool = require('../connection');

// Function to get all employees
async function getAllEmployees() {
  const [rows] = await pool.query('SELECT * FROM employee');
  return rows;
}

// Add more functions for employee queries as needed

module.exports = {
  getAllEmployees
  // Export other functions here
};