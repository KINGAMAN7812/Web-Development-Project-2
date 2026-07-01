const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose.connect("mongodb+srv://devgaur0809_db_user:l5cb1rOTEMaSo5Gk@cluster0.xagjvdl.mongodb.net/HospitalDB?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

const patientSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    dateOfAdmission: { type: String, required: true },
    illnessName: { type: String, required: true }
});

const Patient = mongoose.model("Patient", patientSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", async(req, res) => {
    try {

        const newPatient = new Patient({
            patientName: req.body.patientName,
            dateOfAdmission: req.body.dateOfAdmission,
            illnessName: req.body.illnessName
        });

        await newPatient.save();

        res.send(`
            <style>
                body{
                    font-family:Arial;
                    background:#eef2f3;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                }

                .card{
                    background:white;
                    padding:30px;
                    border-radius:10px;
                    box-shadow:0 4px 10px rgba(0,0,0,0.2);
                    text-align:center;
                }

                a{
                    text-decoration:none;
                    color:blue;
                    font-weight:bold;
                }
            </style>

            <div class="card">
                <h2>✅ Patient Registered Successfully</h2>

                <p><b>Name:</b> ${req.body.patientName}</p>
                <p><b>Date:</b> ${req.body.dateOfAdmission}</p>
                <p><b>Illness:</b> ${req.body.illnessName}</p>

                <a href="/">Register Another Patient</a>
            </div>
        `);

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.get("/patients", async(req, res) => {

    try {

        const patients = await Patient.find();

        let rows = "";

        patients.forEach(p => {
            rows += `
                <li>
                    <strong>Name:</strong> ${p.patientName} |
                    <strong>Date:</strong> ${p.dateOfAdmission} |
                    <strong>Illness:</strong> ${p.illnessName}
                </li>
            `;
        });

        if (patients.length === 0) {
            rows = "<p>No Patients Registered.</p>";
        }

        res.send(`
            <style>
                body{
                    font-family:Arial;
                    background:#eef2f3;
                    display:flex;
                    justify-content:center;
                    padding-top:40px;
                }

                .card{
                    background:white;
                    padding:30px;
                    border-radius:10px;
                    width:500px;
                    box-shadow:0 4px 10px rgba(0,0,0,0.2);
                }

                ul{
                    padding-left:20px;
                }

                li{
                    margin-bottom:12px;
                }

                a{
                    text-decoration:none;
                    color:blue;
                    font-weight:bold;
                }
            </style>

            <div class="card">

                <h2>📋 Registered Patients</h2>

                <ul>
                    ${rows}
                </ul>

                <a href="/">← Back to Form</a>

            </div>
        `);

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }

});

app.listen(3000, () => {
    console.log("Server Running at http://localhost:3000");
});
