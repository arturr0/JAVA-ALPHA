const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // To load the .env file with environment variables

const app = express();
const port = process.env.PORT || 10000;  // Use Render's assigned port or default to 10000

// PostgreSQL connection setup using environment variables
const pool = new Pool({
  user: process.env.DB_USER,            // Your database username
  host: process.env.DB_HOST,            // Your external database host
  database: process.env.DB_NAME,        // Your database name
  password: process.env.DB_PASSWORD,    // Your database password
  port: process.env.DB_PORT || 5432,    // Default to 5432 if DB_PORT is not set
  ssl: {
    rejectUnauthorized: false           // Allow self-signed certificates (optional, depends on your setup)
  }
});

// Test the database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);  // Exit if unable to connect to the database
  });

// Define a route to check if the server is working
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Example route to get data from PostgreSQL
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Replace with your actual query
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
