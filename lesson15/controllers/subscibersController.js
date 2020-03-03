const mongoose = require("mongoose"),
    datamodels = require("../models/datamodels.js")

exports.getAllSubscribers = (req, res, next) => {
    datamodels.Subscriber.find( {}, (error, subscribers) => {
        if (error) next(error);
        req.data = subscribers;
        next();
    })
}

exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
} 

exports.saveSubscriber = (req, res) => {
    let newSubscriber = datamodels.Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });
    
    newSubscriber.save((error, result) => {
        if (error) res.send(error);
        res.render("thanks")
        console.log(`User ${req.body.name} added to database`)
    })
} 
