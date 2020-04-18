const User = require('../models/user');
getUserParams = body => {
    return {        
    name: {
                first: body.first,
                last: body.last
            },
            email: body.email,
            password: body.password,
            zipCode: body.zipCode
        };
}; 

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
        // flash message passed directly as local variable
        res.render("users/index", {
            flashMessages: {
                success: "Loaded all users!"    
            }
        });
    },

    new: (req, res) => {
        res.render("users/new");
    },

    create: (req, res, next)  => {
    let userParams = getUserParams(req.body);
    User.create(userParams)
            .then(user  =>  {
                req.flash("success", `${user.fullName}'s account created successfully!'`)
                res.locals.redirect = "/users";
                res.locals.user = user;
                next(); // passes on the resulting created user through the response object
            })
            .catch(error  => {
                console.log(`Error saving user: ${error.message}`);
                res.locals.redirect = "/users/new";
                req.flash("error", `
                Failed to create user account because: ${error.message}
                `);
                next();
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
    },
    
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user  => {
                res.render("users/edit", {
                    user: user
                })
            })
            .catch(error  => {
                console.log(`Error fetching user by ID: ${error.message}`);
            });
    },

    update: (req, res, next) => {
    let userId = req.params.id;
        userParams = getUserParams(req.body);

       User.findByIdAndUpdate(userId, {
            $set: userParams
        })
            .then(user  => {
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                req.flash('success', `${user.fullName} successfully updated!`)
                next();
            })
            .catch(error  => {
                req.flash('error', `Error ${error.message} occured while updating user.`)
                console.log(`Error updating user by ID: ${error.message}`);
                next();
            });
    },
    delete: (req, res, next)  => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                req.flash('success', `User deleted!`)
                res.locals.redirect = "/users";
                next();
            })
            .catch(error  => {
                req.flash('error', `Error ${error.message} occured while deleting user!`)
                res.locals.redirect = "/users"
                console.log('Error deleting user by ID: ${error.message}');
                next();
            });
    }
};
