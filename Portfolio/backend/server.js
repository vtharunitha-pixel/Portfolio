const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Middleware Configurations
app.use(cors());
app.use(express.urlencoded({ extended: true })); // ⚡ Crucial to read normal HTML form fields!
app.use(express.json());

// 1. Create the MySQL Database Connection Pool Profile
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',          
    password: 'yours', // Your exact MySQL Workbench master login password
    database: 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Validate the connection channel immediately on startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("\n❌ MySQL Database connection failed!");
        console.error(`Reason: ${err.message}\n`);
    } else {
        console.log("\n🔌 Connected successfully to local MySQL Database!");
        connection.release();
    }
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // 1. SQL command structure to insert data rows
    const sqlInsert = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
    
    db.query(sqlInsert, [name, email, message], (err, result) => {
        if (err) {
            console.error("❌ SQL Query execution error:", err);
            return res.status(500).send("Database save failed.");
        }
        
        console.log(`\n💾 SUCCESS: Saved message from "${name}" securely inside MySQL!`);
        
        // 2. THIS IS THE REFRESHED MESSAGE TEMPLATE THAT SENDS BACK TO THE BROWSER
        res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
                <h2 style="color: #28a745;">🎉 Success! Your message has been saved to the MySQL Database.</h2>
                <a href="javascript:history.back()" style="font-weight: bold; color: #032a9e; text-decoration: none; font-size: 18px;">← Click here to go back to my portfolio</a>
            </div>
        `);
    });
});

// Start the server pipeline and listen on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`>>> Backend server is running on http://localhost:${PORT}`);
});

