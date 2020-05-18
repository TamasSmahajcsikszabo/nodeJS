const http = require("http-status-codes")


// errorhandle: (error, req, res, next) => {
//     console.error(error.stack)
//     next(error)
// } 


module.exports = {
    pageNotFoundError: (req, res, next) => {
        let errorCode = http.NOT_FOUND;
        res.status(errorCode);
        res.render("error");
        next();
},
    internalServerError: (error, req, res, next) => {
        let errorCode = http.INTERNAL_SERVER_ERROR;
        console.log(`ERROR occured: ${error.stack}`);
        res.status(errorCode);
        res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
        next();
}
}


