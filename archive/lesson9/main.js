const port = 3000,
    express = require("express"),
    homeController = require("./controllers/homeController"),
    app = express()

app.get("/", homeController.welcome)

app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())


app.use(homeController.logRequestPath)

app.get("/items/:vegetable", homeController.sendReqParam)

app.post("/", homeController.postStatus)
app.post("/sign_up", homeController.userSignUpProcessor)

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})

