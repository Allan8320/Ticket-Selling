const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-Memory Database (mocking a real database)
let tickets = [
    { 
        id: 1, 
        sellerName: 'John Doe',
        eventName: 'Coldplay Spheres World Tour', 
        eventDate: '2024-12-15',
        location: 'Wembley Stadium, London',
        ticketType: 'VIP Standing',
        price: 5000, 
        status: 'available' 
    },
    { 
        id: 2, 
        sellerName: 'Jane Smith',
        eventName: 'Arijit Singh Live on Stage', 
        eventDate: '2024-11-20',
        location: 'Jio World Garden, Mumbai',
        ticketType: 'General Admission',
        price: 3000, 
        status: 'booked' 
    },
    { 
        id: 3, 
        sellerName: 'Techie Bob',
        eventName: 'Google I/O Extended 2024', 
        eventDate: '2025-05-10',
        location: 'Virtual / Online',
        ticketType: 'Early Bird',
        price: 1500, 
        status: 'available' 
    }
];

// Routes
// 1. Get all tickets
app.get('/api/tickets', (req, res) => {
    res.json(tickets);
});

// 2. Book a ticket
app.post('/api/book/:id', (req, res) => {
    const ticketId = parseInt(req.params.id);
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);

    if (ticketIndex === -1) {
        return res.status(404).json({ message: 'Ticket not found' });
    }

    if (tickets[ticketIndex].status === 'booked') {
        return res.status(400).json({ message: 'Ticket is already booked' });
    }

    tickets[ticketIndex].status = 'booked';
    res.json({ message: 'Ticket booked successfully', ticket: tickets[ticketIndex] });
});

// 3. Resell a new ticket
app.post('/api/resell', (req, res) => {
    const { sellerName, eventName, eventDate, location, ticketType, price } = req.body;
    
    // Basic validation
    if (!sellerName || !eventName || !eventDate || !price) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newTicket = {
        id: tickets.length + 1,
        sellerName,
        eventName,
        eventDate,
        location: location || 'TBA',
        ticketType: ticketType || 'Standard',
        price: parseInt(price),
        status: 'available'
    };

    tickets.push(newTicket);
    res.status(201).json({ message: 'Ticket listed for resale successfully', ticket: newTicket });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
