//this will call for the express module
const express = require ('express');
const app = express();
const db = require('./db');
//cors module for CRUD use
const cors = require('cors');
app.use(cors());
// for opening the app
const path = require('path');

// Middleware to parse JSON requests
app.use(express.json());

// Import authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

//allow public folder to be used
app.use(express.static(path.join(__dirname + '/public')));

app.listen(process.env.PORT || 8080, () => {
    console.log("Website running in http://localhost:8080/")
});

//usage of the CRUD elements
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const packageRoutes = require('./routes/packageRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');


app.use('/classes', classRoutes);
app.use('/packages', packageRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/users', userRoutes);