const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files (like index.css) from the root directory
app.use(express.static(__dirname));

// Route to serve the registration form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {
    const { patientName, dateOfAdmission, illnessName } = req.body;

    const patientData = `Name: ${patientName}, Date: ${dateOfAdmission}, Illness: ${illnessName}\n`;

    fs.appendFile("patient_registry.txt", patientData, (err) => {
        if (err) {
            console.error("Failed to write to file:", err);
            return res.status(500).send("<h3>Internal Server Error</h3>");
        }

        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                <h2 style="color: #2563eb;">${patientName} Registered Successfully!</h2>
                <br>
                <a href="/" style="color: #2563eb; text-decoration: none;">Register Another Patient</a>
                <br><br>
                <a href="/patients" style="color: #2563eb; text-decoration: none;">View Patients</a>
            </div>
        `);
    });
});


app.get("/patients", (req, res) => {
    const filePath = path.join(__dirname, "patient_registry.txt");


    if (!fs.existsSync(filePath)) {
        return res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                <h2>No Patients Registered Yet</h2>
                <br>
                <a href="/" style="color: #2563eb; text-decoration: none;">Back</a>
            </div>
        `);
    }
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return res.status(500).send("<h3>Internal Server Error</h3>");
        }

        res.send(`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h1 style="color: #2563eb; text-align: center;">Registered Patients</h1>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 14px; overflow-x: auto;">${data}</pre>
                <br>
                <a href="/" style="display: block; text-align: center; color: #2563eb; text-decoration: none;">Back to Home</a>
            </div>
        `);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
