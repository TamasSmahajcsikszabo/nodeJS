const express = require("express"),
    hc = require("./controllers/homeControllers"),
    layouts = require("express-ejs-layouts"),
    app = express()

app.set("port", process.env.PORT || 3000) // application settings property

// initiate using templating
app.set("view engine", "ejs") // to set the view engine as 'ejs'

app.use(layouts)

app.get("/name/:myName", hc.respondWithName)

app.listen(app.get("port"), () => {
    console.log(`Server listening on: ${ app.get("port") }`)
})
