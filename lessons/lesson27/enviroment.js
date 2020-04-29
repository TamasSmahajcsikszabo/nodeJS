const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
);
mongoose.Promise = global.Promise;
