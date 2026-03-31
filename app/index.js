const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet()); 
app.use(morgan('combined'));
app.use(express.json());

// In-memory patient store (Initial Data)
let patients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Stable' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Recovering' }
];

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Role-Based Access Control (RBAC) Middleware Simulation
const authorize = (roles = []) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'] || 'guest';
        console.log(`[AUTH] Access attempt by role: ${userRole} to ${req.path}`);
        
        if (roles.length && !roles.includes(userRole)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

// Patient API: Get all patients (Accessible by Doctor and Admin)
app.get('/api/patients', authorize(['doctor', 'admin']), (req, res) => {
    res.json(patients);
});

// Patient API: Add patient (Only accessible by Admin)
app.post('/api/patients', authorize(['admin']), (req, res) => {
    const { name, age, condition } = req.body;

    if (!name || typeof name !== 'string' || name.length < 2) {
        return res.status(400).json({ error: 'Valid name is required (min 2 characters)' });
    }
    if (!age || typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ error: 'Valid age is required (positive number)' });
    }
    if (!condition || typeof condition !== 'string') {
        return res.status(400).json({ error: 'Condition is required' });
    }

    const newPatient = {
        id: patients.length + 1,
        name,
        age,
        condition
    };

    patients.push(newPatient);
    console.log(`[AUDIT] Patient added: ${name} (ID: ${newPatient.id})`);
    res.status(201).json(newPatient);
});

// Simple UI Simulation Helper
app.get('/', (req, res) => {
    res.send('<h1>Secure Healthcare System</h1><p>API is running. Access <a href="/api/patients">/api/patients</a></p>');
});

app.listen(port, () => {
    console.log(`Healthcare app listening at http://localhost:${port}`);
});

module.exports = app;
