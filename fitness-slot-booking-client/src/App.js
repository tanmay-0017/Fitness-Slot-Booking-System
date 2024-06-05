import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [classes, setClasses] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/classes')
            .then(response => setClasses(response.data));
    }, []);

    const bookSlot = (classId) => {
        axios.post('http://localhost:3000/book', { userId, classId })
            .then(response => alert(response.data.message))
            .catch(error => alert(error.response.data.message));
    };

    const cancelSlot = (classId) => {
        axios.post('http://localhost:3000/cancel', { userId, classId })
            .then(response => alert(response.data.message))
            .catch(error => alert(error.response.data.message));
    };

    return (
        <div>
            <h1>Fitness Slot Booking System</h1>
            <input 
                type="text" 
                placeholder="Enter User ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
            />
            <div className="container">
                {classes.map(fitnessClass => (
                    <div className="card" key={fitnessClass.id}>
                        <h2>{fitnessClass.type}</h2>
                        <p>Capacity: {fitnessClass.capacity}</p>
                        <p>Bookings: {fitnessClass.bookings.length}</p>
                        <p>Waiting List: {fitnessClass.waitlist.length}</p>
                        <button onClick={() => bookSlot(fitnessClass.id)}>Book</button>
                        <button onClick={() => cancelSlot(fitnessClass.id)}>Cancel</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
