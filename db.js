const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/orderManagement';

mongoose.connect(url, {useNewUrlParser: true});

const db = mongoose.connection;

module.exports = db;


