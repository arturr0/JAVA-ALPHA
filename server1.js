require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Use pg for PostgreSQL
const app = express();

app.use(cors());
app.use(express.json());

// Create a database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test database connection
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});

// Example routes
app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/items', (req, res) => {
    const { name, description } = req.body;
    db.query(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [name, description],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, name, description });
        }
    );
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
