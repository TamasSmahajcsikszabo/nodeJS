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
        res.render("users/new");
    },

    create: (req, res, next)  => {
        let userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
    User.create(userParams)
            .then(user  =>  {
                res.locals.redirect = "/users";
                res.locals.user = user;
                next();
            })
            .catch(error  => {
                console.log(`Error saving user: ${error.message}`);
                next(error);
            });
    }
}
