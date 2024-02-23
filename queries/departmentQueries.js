// queries/departmentQueries.js

const pool = require('../connection');

// Function to get all departments
async function getAllDepartments() {
  const [rows] = await pool.query('SELECT * FROM department');
  return rows;
}

// Add more functions for department queries as needed

module.exports = {
  getAllDepartments
  // Export other functions here
};