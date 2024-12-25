const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client for Node.js
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Set port for server

// PostgreSQL connection pool setup
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Test connection to database
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Simple query to test connection
        res.send(`Database connected successfully! Server time: ${result.rows[0].now}`);
        console.log(`Database connected successfully! Server time: ${result.rows[0].now}`)
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        res.status(500).send('Database connection failed');
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
    console.log('Hello from the server!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
