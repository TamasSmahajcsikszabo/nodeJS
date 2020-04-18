exports.respondWithName = (req, res) => {
  let paramsName = req.params.myName  
    res.render("index", { name: paramsName })  // render method for responding with a view
} 
exports.contactInformation = (req, res) => { 
    res.render("contact")  // render method for responding with a view
} 
