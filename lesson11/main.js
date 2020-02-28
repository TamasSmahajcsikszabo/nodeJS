const express = require("express"),
    hc = require("./controllers/homeControllers"),
    error = require("./controllers/errorController"),
    layouts = require("express-ejs-layouts"),
    app = express()

app.set("port", process.env.PORT || 3000) // application settings property

// initiate using templating
app.set("view engine", "ejs") // to set the view engine as 'ejs'
app.use(express.static("public")) //enables classic static files as well
app.use(layouts) //to use layouts as an additional layer of middleware
app.get("/name/:myName", hc.respondWithName)
app.get("/contact", hc.contactInformation)

// app.use(error.errorHandle)
app.use(error.respondNoResourceFound)
app.use(error.respondInternalError)
app.listen(app.get("port"), () => {
    console.log(`Server listening on: ${ app.get("port") }`)
})
