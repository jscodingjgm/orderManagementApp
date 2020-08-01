const express = require('express');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
const userOrderDetailsModel = require('../db-util/model');

var isSaved = false;

// express form field validation module
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: '*****.email',
        pass: '***********'
    }
});


router.post('/submitForm',[
    body('femail', 'email is required').isEmail(),
    body('fname', 'name is required').not().isEmpty(),
    body('fAddress', 'password is required').not().isEmpty()
],(req, res) => {
    const userDetailsDoc = new userOrderDetailsModel({
        name : req.body.fname,
        address: req.body.fAddress,
        email : req.body.femail,
        prods : Array.isArray(req.body.fprod) && req.body.fprod.length > 1 ?req.body.fprod.map(elem => elem) : req.body.fprod,
        insertionDate : new Date()
    });

    userDetailsDoc.save((err, doc) => {
        if(err) return console.log(err);

        console.log(doc);
        isSaved = true;
        res.redirect('/userForm');
    });
});

router.get('/userForm', (req, res) => {
    const productObj = fs.readFileSync('./products.json');
    res.render('body', {
        isSaved : isSaved,
        products : JSON.parse(productObj).products
    });
});

router.get('/admin', (req, res) => {
    userOrderDetailsModel.find((err, doc) => {
        res.render('admin/dashboard', {
            orderDetails : doc
        });
    });
});

router.get('/sendEmail/:id', (req, res) => {
    userOrderDetailsModel.findOne({ _id : req.params.id}, (err, doc) => {
        if(err)
            res.send('Error Fetching Data!');
        
        const mailOptions = {
            from: 'geovanni35@ethereal.email',
            to: 'geovanni35@gmail.com',
            subject: doc.name+' Your Order Details Status is,' + doc.orderStatus,
            text: '',
            html: '<p>Below are the products purchased by you<p><h3>'+doc.prods.join(',')+'</h3>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err)
                res.send('Error Sending Email');
            
            userOrderDetailsModel.updateOne({_id : req.params.id}, {emailStatus: 'Email Sent'}, (err, doc) => {
                if(err)
                    console.log(err);
                
                res.redirect('/admin');
            });
        });
    });
});

module.exports = router;