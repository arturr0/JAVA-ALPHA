const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool setup
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Route to test table creation and data insertion
app.get('/test-table', async (req, res) => {
    try {
        // Insert data into the 'users' table
        await pool.query("INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com')");
        
        // Query the data from the 'users' table
        const result = await pool.query('SELECT * FROM users');
        
        // Send back the results
        res.json(result.rows);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Database operation failed');
    }
});
app.get('/display-data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        
        // Creating a simple HTML table from the database results
        let htmlContent = '<table border="1"><tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr>';
        
        result.rows.forEach(row => {
            htmlContent += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.created_at}</td></tr>`;
        });
        
        htmlContent += '</table>';
        
        res.send(htmlContent);
    } catch (err) {
        console.error('Error querying database:', err.message);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
