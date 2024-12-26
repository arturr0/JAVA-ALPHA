const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Load .env file

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    createTableIfNotExists();
    insertSampleData();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

async function createTableIfNotExists() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log('Table ready');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

async function insertSampleData() {
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Alice Johnson', email: 'alice@example.com' },
  ];
  for (const user of users) {
    try {
      await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.name, user.email]);
    } catch (err) {
      console.error('Error inserting sample data:', err);
    }
  }
}

app.post('/add-user', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
