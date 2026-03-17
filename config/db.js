const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected Successfully ${conn.connection.host}:${process.env.PORT}`);
    } catch(err) {
        console.error("Database connection failed!", err.message);
        process.exist(1);
    }
}

module.exports = connectDB;