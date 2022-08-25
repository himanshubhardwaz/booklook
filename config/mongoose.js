//require mongoose middleware to access mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://docker:mongopw@localhost:55000');
//create connection string
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('Successfully connected to database');
})