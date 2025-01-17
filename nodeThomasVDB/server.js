require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

console.log("Starting the server...");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log("Connecting to MySQL...");

db.connect(err => {
    if (err) {
        console.error("MySQL Connection Failed:", err);
        process.exit(1);  // Exit if MySQL connection fails
    }
    console.log("Connected to MySQL Database ✅");
});

// Test a query
db.query('SELECT 1', (err, result) => {
    if (err) {
        console.error("Test Query Failed:", err);
    } else {
        console.log("Test Query Successful", result);
    }
});

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


app.get('/', (req, res) => {
    res.send('<h1></p>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});