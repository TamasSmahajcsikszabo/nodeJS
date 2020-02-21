//constants
const port = 3000
const routeMap = {
    "/": "views/index.html"
}
const getViewUrl = (url) => {
    return `view${url}.html`
} 

//modules
http = require("http")
httpStatus = require("http-status-codes")
fs = require("fs")

//main
http.createServer((req, res) => {
    res.writeHead(httpStatus.OK, {
        "Content-Type": "text/html"
    })
    if (routeMap[req.url]) {
        fs.readFile(routeMap[req.url], (error, data) => {
            if (error == null ){
                console.log('No error encountered.')
            } else {
                console.log(error)
                }
            res.write(data)
            res.end()
        })  
    } else {
        res.end("<h1>Sorry, not found </h1>")
    }
}).listen(port)
console.log(`The server has started and is listening on port number: ${port}`)
