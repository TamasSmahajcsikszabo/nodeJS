const mongoose = require("mongoose"),
    subscriberController = require("./controllers/subscribersController"),
    homeController = require("./controllers/homeController.js"),
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express();
mongoose.connect("mongodb://localhost:27017/confetti_quisine", 
    { useNewUrlParser: true })

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

mongoose.Promise = global.Promise
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/courses", homeController.showCourses)
app.get("/subscribers", subscriberController.getAllSubscribers)
app.get("/contact", subscriberController.getSubscriptionPage)
app.post("/subscribe", subscriberController.saveSubscriber)



app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
