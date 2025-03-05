//calling the modules
const express = require ('express');
const cors = require('cors');
const path = require('path');
const app = express();
const errorHandler = require('./utils/errorHandler');
app.use(express.json());
app.use(cors());

//call in the db API script
const db = require('./db');

// Import authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

//allow public folder to be used
app.use(express.static(path.join(__dirname + '/public')));

// Global Error Handler
app.use(errorHandler);

app.listen(8080, () => {
    console.log("Webpage running in http://localhost:8080/")
});

//usage of the CRUD elements
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const packageRoutes = require('./routes/packageRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const managerRoutes = require('./routes/managerRoutes');
const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);
app.use('/manager', managerRoutes);
app.use('/classes', classRoutes);
app.use('/packages', packageRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/users', userRoutes);