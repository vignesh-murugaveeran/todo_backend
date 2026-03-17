const express = require('express');
const userRoutes = require('./routes/user_routes');

const app = express();

//Middleware to read json body
app.use(express.json());

//use routes
app.use('/api/users', userRoutes);

module.exports = app;