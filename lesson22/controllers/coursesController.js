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
    }, 
    new: (req, res) => {
        res.render("courses/new");
    },

    create: (req, res, next)  => {
        let courseParams = {
            title: req.body.title,
            description: req.body.description,
            items: req.body.items,
            zipCode: req.body.zipCode
        };
    Course.create(courseParams)
            .then(course =>  {
                res.locals.redirect = "/courses";
                res.locals.course = course;
                next(); // passes on the resulting created user through the response object
            })
            .catch(error  => {
                console.log(`Error saving course : ${error.message}`);
                next(error);
                res.locals.redirect = "/courses/new";
            });
    },
    
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
            .then(course=> {
                res.locals.course = course;
                next();
            })
            .catch(error => {
                console.log(`Error fetching course by ID: ${error.message}`);
            })
    },

    showView: (req, res) => {
        res.render("courses/show");
    },

    edit: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
            .then(course  => {
                res.render("courses/edit", {
                    course: course
                })
            })
            .catch(error  => {
                console.log(`Error fetching course by ID: ${error.message}`);
            });
    },

    update: (req, res, next) => {
        let courseId = req.params.id;
        courseParams = {
            title: req.body.title,
            description: req.body.description,
            items: req.body.items,
            zipCode: req.body.zipCode
        };

       Course.findByIdAndUpdate(courseId, {
            $set: courseParams
        })
            .then(course  => {
                res.locals.redirect = `/courses/${courseId}`;
                res.locals.course = course;
                next();
            })
            .catch(error  => {
                console.log(`Error updating course by ID: ${error.message}`);
                next(error);
            });
    },

    delete: (req, res, next)  => {
        let courseId = req.params.id;
        Course.findByIdAndRemove(courseId)
            .then(() => {
                res.locals.redirect = "/courses";
                next();
            })
            .catch(error  => {
                console.log('Error deleting course by ID: ${error.message}');
                next(error);
            });
    }
};
