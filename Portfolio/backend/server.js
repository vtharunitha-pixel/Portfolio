const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// 1. Core Middleware Configuration
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Essential for reading normal HTML forms
app.use(express.json()); // Essential for handling JSON requests

// 2. Adaptive Database Connection Configuration Pool
const db = mysql.createPool({
    // If Render provides a main Connection URI, it uses that first.
    uri: process.env.DATABASE_URL, 
    
    // Otherwise, it falls back to the individual discrete parameters (Cloud or Local laptop)
    host:'bjwbigb6xkocf1rwfq2c-mysql.services.clever-cloud.com',
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
            return res.status(500).send("Database transaction save failed.");
        }
        
        console.log(`💾 SUCCESS: Row inserted safely into table row ID: ${result.insertId}`);
        
        // Render a clean visual confirmation screen for the end-user
        res.send(`
            <div style="text-align: center; margin-top: 60px; font-family: sans-serif; background-color: #f8f9fa; padding: 40px; max-width: 500px; margin-left: auto; margin-right: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h1 style="color: #28a745; margin-bottom: 10px;">🎉 Success!</h1>
                <p style="color: #495057; font-size: 16px; margin-bottom: 25px;">Your message has been saved securely to the MySQL Cloud Database.</p>
                <a href="javascript:history.back()" style="font-weight: bold; color: #032a9e; text-decoration: none; border: 2px solid #032a9e; padding: 10px 20px; border-radius: 5px; background-color: #ffffff; transition: all 0.2s;">← Go Back to Portfolio</a>
            </div>
        `);
    });
});

// 4. Start the server engine listening on dynamic cloud environmental port mappings
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`>>> Backend server is running on port ${PORT}`);
});
