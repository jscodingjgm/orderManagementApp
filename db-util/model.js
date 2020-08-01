const mongoose = require('mongoose');

const userOrderDetailsSchema = new mongoose.Schema({
    name: String,
    address: String,
    email: String,
    prods: Array,
    insertionDate: Date,
    emailStatus: String,
    orderStatus: String
});

const userOrderDetailsModel = mongoose.model('userOrderDetailsModel', userOrderDetailsSchema);


module.exports = userOrderDetailsModel;