const Subscriber = require("../models/subscriber.js")
getSubscriberParams = body  => {
    return {
            username: body.username,
            name: body.name,
            email: body.email,
            zipCode: body.zipCode
        
    }
};

module.exports = {
    index: (req, res) => {
    Subscriber.find({})
        .exec()
        .then((subscribers) => {
            res.locals.subscribers = subscribers;
            if (req.query.format == "json") {
                res.json(res.locals.subscribers);
            } else {
                res.render("subscribers/index", {
                    subscribers: subscribers
                });
            }
        })
        .catch((error) => {
            console.log(error.message)
            return []
        })
        .then(() => {
            console.log("promise complete")
        })
},

    new: (req, res) => {
        res.render("subscribers/new");
    },

    create: (req, res, next)  => {
        let subscriberParams = getSubscriberParams(req.body);

    Subscriber.create(subscriberParams)
            .then(subscriber =>  {
                req.flash('success', `Subscribed successfully!`)
                res.locals.redirect = "/subscribers";
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error  => {
                console.log(`Error saving subscriber: ${error.message}`);
                res.locals.redirect = "/subscribers/new";
                req.flash('error', `Error occured: ${error.message}`);
                next();
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    show: (req, res, next) => {
        let subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then( subscriber => {
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error => {
                console.log(`Error fetching subscriber by ID: ${error.message}`);
            })
    },

    showView: (req, res) => {
        if (req.query.format == "json") {
            res.json(res.locals.subscriber);
        } else{
        res.render("subscribers/show");
    }
    },

    edit: (req, res, next) => {
        let subscriberId = req.params.id;
        Subscriber.findById(subscriberId)
            .then(subscriber => {
                res.render("subscribers/edit", {
                    subscriber: subscriber
                })
            })
            .catch(error  => {
                console.log(`Error fetching subscriber by ID: ${error.message}`);
            });
    },

    update: (req, res, next) => {
        let subscriberId = req.params.id;
        subscriberParams = getSubscriberParams(req.body);

       Subscriber.findByIdAndUpdate(subscriberId, {
            $set: subscriberParams
        })
            .then(subscriber => {
                res.locals.redirect = `/subscribers/${subscriberId}`;
                res.locals.subscriber = subscriber;
                req.flash('success', `Successfully updated data for subscriber ${subscriber.name}`)
                next();
            })
            .catch(error  => {
                console.log(`Error updating subscriber by ID: ${error.message}`);
                req.flash('error', `While updating error encountered: ${error.message}`)
                next();
            });
    },
    delete: (req, res, next)  => {
        let subscriberId = req.params.id;
        Subscriber.findByIdAndRemove(subscriberId)
            .then(() => {
                res.locals.redirect = "/subscribers";
                req.flash('success', `Subscriber deleted!`)
                next();
            })
            .catch(error  => {
                console.log('Error deleting subscribers by ID: ${error.message}');
                res.locals.redirect = "/subscribers";
                req.flash('error', `Error while deletingsubscriber!`)
                next();
            });
    }
}
