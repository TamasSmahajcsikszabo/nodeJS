const http = require("http-status-codes")

// exports.errorHandle = (error, req, res, next) => {
    // console.error(error.stack)
    // next(error)
// } 

exports.respondNoResourceFound = (req, res) => {
    let errorCode = http.NOT_FOUND
    res.status(errorCode)
    // res.send(`${errorCode} | The page does not exist!`)
    res.sendFile(`./public/${errorCode}.html`, {root: "./"})
} 
exports.respondInternalError = (error, req, res, next) => {
    let errorCode = http.INTERNAL_SERVER_ERROR
    console.log(`ERROR occured: ${error.stack}`)
    res.status(errorCode)
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`)
} 
