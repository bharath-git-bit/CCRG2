const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Azure DocumentDB
mongoose.connect(process.env.MONGO_URI)
const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Waiting"
    }
}, {
    timestamps: true
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
  

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Queue Backend is running"
    });
});

// Health route
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Backend is working"
    });
});


   

// Create appointment
app.post("/api/v1/appointments", async (req, res) => {
    try {
        const { name, service, date, time, phone } = req.body;

        if (!name || !service || !date || !time || !phone) {
            return res.status(400).json({
                success: false,
                message: "All appointment fields are required"
            });
        }

        const appointment = await Appointment.create({
            name,
            service,
            date,
            time,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {
        console.error("Appointment creation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create appointment"
        });
    }
});


// Get appointments
app.get("/api/v1/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error("Error fetching appointments:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments"
        });
    }
});

// Test database connection
app.get("/api/v1/db-test", (req, res) => {
    const connected = mongoose.connection.readyState === 1;

    res.json({
        database: connected ? "Connected" : "Not Connected"
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Smart Queue Backend running on port ${PORT}`);
});