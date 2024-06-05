const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const classes = [
    { id: 1, type: 'Yoga', capacity: 10, bookings: [], waitlist: [], startTime: new Date('2024-06-06T10:00:00') },
    { id: 2, type: 'Gym', capacity: 15, bookings: [], waitlist: [], startTime: new Date('2024-06-06T12:00:00') },
    { id: 3, type: 'Dance', capacity: 20, bookings: [], waitlist: [], startTime: new Date('2024-06-06T14:00:00') }
];

// API to book a slot
app.post('/book', (req, res) => {
    const { userId, classId } = req.body;
    const fitnessClass = classes.find(c => c.id === classId);

    if (!fitnessClass) {
        return res.status(404).json({ message: 'Class not found' });
    }

    if (fitnessClass.bookings.length < fitnessClass.capacity) {
        fitnessClass.bookings.push(userId);
        return res.json({ message: 'Booking confirmed' });
    } else {
        fitnessClass.waitlist.push(userId);
        return res.json({ message: 'Added to waitlist' });
    }
});

// API to cancel a booking
app.post('/cancel', (req, res) => {
    const { userId, classId } = req.body;
    const fitnessClass = classes.find(c => c.id === classId);

    if (!fitnessClass) {
        return res.status(404).json({ message: 'Class not found' });
    }

    const bookingIndex = fitnessClass.bookings.indexOf(userId);
    const currentTime = new Date();
    const timeDifference = (fitnessClass.startTime - currentTime) / 1000 / 60; // in minutes

    if (timeDifference < 30) {
        return res.status(400).json({ message: 'Cannot cancel within 30 minutes of the class' });
    }

    if (bookingIndex !== -1) {
        fitnessClass.bookings.splice(bookingIndex, 1);
        if (fitnessClass.waitlist.length > 0) {
            const nextUser = fitnessClass.waitlist.shift();
            fitnessClass.bookings.push(nextUser);
        }
        return res.json({ message: 'Booking cancelled and slot reallocated if needed' });
    } else {
        return res.status(404).json({ message: 'User not found in bookings' });
    }
});

// API to get list of classes
app.get('/classes', (req, res) => {
    res.json(classes);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
