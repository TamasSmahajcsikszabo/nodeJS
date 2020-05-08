"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeControllers"),
    errorController = require("./controllers/errorController.js"),
    layouts = require("express-ejs-layouts"),
    mongo = require("mongodb").MongoClient,
    dbURL = "mongodb://localhost:27017",
    dbName = "ice_cream_truck";

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

mongo.connect(dbURL, (error, client) => {
    if (error) throw error;
    let db = client.db(dbName);
    db.collection("ice_cream_flavours")
        .insert({
            flavour: "raspberry",
            quantity: 13
        }, (error, db) => {
            if (error) throw error;
            console.log(db);
        });
    db.collection("ice_cream_flavours")
        .find()
        .toArray((error, data) => {
            if (error) throw error;
            console.log(data);
        })
})
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpFrom);

app.use(errorController.pageNotFoundError)
app.use(errorController.internalServerError)
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
