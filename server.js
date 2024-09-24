const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(express.static('public')); // Serve static files from the 'public' directory

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    complaintType: String,
    complaintDetails: String,
    complaintImage: String,
    status: { type: String, default: 'Pending' },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Route to serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

// Route to fetch complaints data for admin
app.get('/admin-data', async (req, res) => {
    try {
        const complaints = await Complaint.find({});
        res.json(complaints);
    } catch (error) {
        res.status(500).send('Error loading complaints.');
    }
});

// Route to update the status of a complaint
app.post('/update-complaint-status/:id', async (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;

    try {
        await Complaint.findByIdAndUpdate(complaintId, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

