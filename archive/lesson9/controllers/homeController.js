exports.welcome = (req, res) => {
    res.send("Welcome!")
} 
exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable
    res.send(`This is the page for ${veg}`)
} 
exports.logRequestPath = (req, res, next) => {
    console.log(`request made to: ${req.url}`)
    console.log(req.query)
    next()
}

exports.postStatus = (req, res) => {
    console.log(req.body)
    console.log(`post: ${req.query}`)
    res.send("post successful!")
}

exports.userSignUpProcessor = (req, res) => {  
    res.send("You have successfully signed up!\n")
}
