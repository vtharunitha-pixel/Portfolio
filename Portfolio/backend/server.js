const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// 1. Core Middleware Configuration
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Essential for reading normal HTML forms
app.use(express.json()); // Essential for handling modern JSON background requests

// 2. Adaptive Database Connection Configuration Pool
const db = mysql.createPool({
    // If Render provides a main Connection URI, it uses that first.
    uri: process.env.DATABASE_URL, 
    
    // Otherwise, it falls back to the individual discrete parameters (Cloud or Local laptop)
    host: '://clever-cloud.com',
    user: 'u0p26txm1rn99gro',          
    password: 'g3iPaWqdjGx4pETyYsdL', 
    database: 'bjwbigb6xkocf1rwfq2c',
    port: 3306,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the cloud database connection pipeline instantly on application boot-up
db.getConnection((err, connection) => {
    if (err) {
        console.error("\n❌ Database connection failed!");
        console.error(`Reason: ${err.message}\n`);
    } else {
        console.log("\n🔌 Connected successfully to your Cloud MySQL Database!");
        connection.release();
    }
});

// 3. API POST Route Destination Endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Server console tracking logs
    console.log("\n=================================");
    console.log("   📥 NEW PORTFOLIO SUBMISSION   ");
    console.log("=================================");
    console.log(`User:    ${name}`);
    console.log(`Email:   ${email}`);
    console.log(`Text:    ${message}`);
    console.log("=================================\n");

    const sqlInsert = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
    
    db.query(sqlInsert, [name, email, message], (err, result) => {
        if (err) {
            console.error("❌ SQL Query execution error:", err);
            return res.status(500).json({ success: false, error: "Database transaction save failed." });
        }
        
        console.log(`💾 SUCCESS: Row inserted safely into table row ID: ${result.insertId}`);
        
        // ⚡ FIX: Returns a clean, lightweight JSON object status to satisfy the frontend script
        return res.status(200).json({ success: true, message: "Saved securely" });
    });
});

// 4. Start the server engine listening on dynamic cloud environmental port mappings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`>>> Backend server is running on port ${PORT}`);
});
