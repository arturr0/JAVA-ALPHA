const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // To load the .env file with environment variables

const app = express();
const port = process.env.PORT || 10000;  // Use Render's assigned port or default to 10000

// Middleware to parse JSON data in requests
app.use(express.json());

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

// Example route to insert a new user into the database
app.post('/add-user', async (req, res) => {
  const { name, email } = req.body; // Get user data from request body

  try {
    // Insert user into the 'users' table
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    // Return the inserted user data as a response
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).send('Server error');
  }
});

// Example route to get all users from the database
app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the 'users' table
    const result = await pool.query('SELECT * FROM users');
    
    // Return users as a response
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
