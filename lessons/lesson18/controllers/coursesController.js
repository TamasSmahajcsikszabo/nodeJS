const Course = require('../models/course.js');

module.exports = {
 // action 1 to run the query   
    index: (req, res, next) => {
        Course.find()
            .then(courses => {
                res.locals.courses = courses;
                next();                
            })
            .catch(error  => {
                console.log(`Error fetching courses: ${error.message}`)
                next(error);
            });
    }, 

// action 2 to serve the results to the view
    indexView: (req, res)  => {
        res.render("courses/index");
    } 
};
