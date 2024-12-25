const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Ensure that the PORT environment variable is used (or default to 3000 for local testing)
const port = process.env.PORT || 3000;

// PostgreSQL connection pool setup
const pool = new Pool({
  host: process.env.DB_HOST,           // PostgreSQL host (provided by Render)
  user: process.env.DB_USER,           // Your database username
  password: process.env.DB_PASSWORD,   // Your database password
  database: process.env.DB_NAME,       // Your database name
  port: 5432,                          // PostgreSQL default port (5432)
});

// Endpoint to display data from the PostgreSQL database
app.get('/display-data', async (req, res) => {
  try {
    // Query the 'users' table (or any table you want to display)
    const result = await pool.query('SELECT * FROM users');

    // Send the query result as a response in JSON format
    res.json(result.rows); // result.rows will contain the rows of data from the database
  } catch (err) {
    console.error('Error querying database:', err.message);
    res.status(500).send('Error fetching data');
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
