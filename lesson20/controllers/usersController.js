const User = require('../models/user');

module.exports = {
 // action 1 to run the query   
    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();                
            })
            .catch(error  => {
                console.log(`Error fetching users: ${error.message}`)
                next(error);
            });
    }, 

// action 2 to serve the results to the view
    indexView: (req, res)  => {
        res.render("users/index");
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
                next(); // passes on the resulting created user through the response object
                console.log(`User account with ${userParams.email} has been created successfully!`)
            })
            .catch(error  => {
                console.log(`Error saving user: ${error.message}`);
                next(error);
            });
    },
    
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
            })
    },

    showView: (req, res) => {
        res.render("users/show");
    }
};
