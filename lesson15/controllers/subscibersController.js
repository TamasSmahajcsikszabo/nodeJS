const mongoose = require("mongoose"),
    datamodels = require("../models/datamodels.js")

// promise version of this function
exports.getAllSubscribers = (req, res) => {
    datamodels.Subscriber.find({})
        .exec() //invoking the query to return a promise

        .then((subscribers)  =>  {
            res.render("subscribers", {
                subscribers: subscribers
            })
        })
        .catch((error)  => {
            console.log(error.message)
            return []
        })
        .then(() => {
            console.log("promise complete")
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
    
    newSubscriber.save()
        .then(result  => {
            res.render("thanks")
            console.log(`User ${req.body.name} saved`)
        })
        .catch(error  => {
            if (error) res.send(error)
        })
    
} 
