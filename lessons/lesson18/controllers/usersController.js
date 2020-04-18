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
    } 
};
