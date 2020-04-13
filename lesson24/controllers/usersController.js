const User = require('../models/user'),
    // bcrypt = require("bcrypt"),
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose");

getUserParams = body => {
    return {        
    username: body.username,
    name: {
                first: body.first,
                last: body.last
            },
            email: body.email,
            // password: body.password,
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
        if (req.skip) next(); //if 'validate finds errors'
        let newUser = new User ( getUserParams(req.body) );

        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully!`);
                req.locals.redirect = "/users";
                next();
            } else {
                req.flash("error", `Failed to create user because: ${error.message}`);
                res.locals.redirect = "/users/new";
                next();
            }
        })
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
    let userId = req.params.id,
        userParams = getUserParams(req.body);
        User.findById({ _id: userId })
            .then(user => {
                // if (user.password != userParams.password) {
                //     user.password = userParams.password;
                //     res.locals.user = user;
                //     res.locals.redirect = `/users/${userId}`; 
                // } 

                if (user.email != userParams.email) {
                    user.email = userParams.email;
                    res.locals.user = user;
                    res.locals.redirect = `/users/${userId}`; 
                }

                user.save();

            })
            .catch(error  => {
                console.log(error.message)
            });

        User.findByIdAndUpdate(userId,
            { $set: userParams })
            .then(user  => {
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                console.log("Update successful!")
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
    },
    login: (req, res) => {
        res.render("users/login");
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    }, 

    // search: (req, res, next)  => {
    //     var id;
    //     User.find({})
    //         .then( users  => {
    //             users.forEach( user  => {
    //                 user.compareEmail(req.body.email)
    //                     .then(matched  => {
    //                         console.log(matched)
    //                         if (matched) {
    //                             id = user._id
    //                             res.locals.user = user;
    //                         } else {
    //                             console.log('no match found')
    //                         }
    //                     })
    //             } )
    //             return id;
    //         } )
    //         .catch(error  => {
    //             console.log(error.message)
    //         })
    // }, 
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login",
        successRedirect: "/", //directs to the main page
        successFlash: "Logged in",
    }),
    validate: (req, res, next) => {
        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true
        }).trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("zipCode", "Zip code is invalid")
            .notEmpty().isInt().isLength({
                min:4,
                max:6
            }).equals(req.body.zipCode);
        req.check("password", "Password cannot be empty").notEmpty();

        //collecting the results of previous validation steps
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e  => e.msg);
                req.skip = true;
                req.flash('error', messages.join(" and "));
                res.locals.redirect = "/users/new";
                next();
            } else {
                next();
            }
        })
    },
    logMail: (req, res, next) => {
        let email = req.body.email.toString();
        let domain = email.substring(email.indexOf("@") + 1, email.indexOf("."));
        console.log(`Recently logged user email domain: ${domain}`);
        next();
    } 
};
