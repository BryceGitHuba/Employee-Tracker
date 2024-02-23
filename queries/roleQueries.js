// queries/roleQueries.js

const pool = require('../connection');

// Function to get all roles
async function getAllRoles() {
  const [rows] = await pool.query('SELECT * FROM role');
  return rows;
}

// Add more functions for role queries as needed

module.exports = {
  getAllRoles
  // Export other functions here
};