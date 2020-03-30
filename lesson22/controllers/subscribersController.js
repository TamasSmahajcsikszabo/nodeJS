const Subscriber = require("../models/subscriber.js")

module.exports = {
    index: (req, res) => {
    Subscriber.find({})
        .exec()
        .then((subscribers) => {
            res.render("subscribers/index", {
                subscribers: subscribers
            })
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
        let userParams = {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        };
    Subscriber.create(userParams)
            .then(subscriber =>  {
                res.locals.redirect = "/subscribers";
                res.locals.subscriber = subscriber;
                next();
                console.log(`${userParams.name} has subscribed successfully!`)
            })
            .catch(error  => {
                console.log(`Error saving subscriber: ${error.message}`);
                next(error);
                res.locals.redirect = "/subscribers/new";
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
                console.log(`Error fetching user by ID: ${error.message}`);
            })
    },

    showView: (req, res) => {
        res.render("subscribers/show");
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
        subscriberParams = {
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        };

       Subscriber.findByIdAndUpdate(subscriberId, {
            $set: subscriberParams
        })
            .then(subscriber => {
                res.locals.redirect = `/subscribers/${subscriberId}`;
                res.locals.subscriber = subscriber;
                next();
            })
            .catch(error  => {
                console.log(`Error updating subscriber by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next)  => {
        let subscriberId = req.params.id;
        Subscriber.findByIdAndRemove(subscriberId)
            .then(() => {
                res.locals.redirect = "/subscribers";
                next();
            })
            .catch(error  => {
                console.log('Error deleting subscribers by ID: ${error.message}');
                next(error);
            });
    }
}
