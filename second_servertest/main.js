const routeResponseMap = {
  '/info': '<h1>Main info page<h1>',
  '/contact': '<h1>Contact us<h1>',
  '/about': '<h1>Learn more<h1>',
    '/hello': `<h1>Say hello by emailing us <a href="mailto:tadee84@gmail.com">here</a> <h1>`,
  '/error': '<h1>Sorry the page you are looking for is not here<h1>'
}
const func = require('./functions.js')
const port = 3000
const http = require('http')
const httpStatus = require('http-status-codes')
app = http.createServer()

app.on('request', (req, res) => {
  var body = []
  req.on('data', (bodyData) => {
    body.push(bodyData)
  })
  req.on('end', () => {
    body = Buffer.concat(body).toString()
    console.log(`Request Body contents: ${body}`)
  })
	if (req.url == "/error") {res.writeHead(httpStatu)} else {res.writeHead(httpStatus.OK, {
    'Content-Type': 'text/html'
  })}
  if (routeResponseMap[req.url]) {
    res.end(routeResponseMap[req.url])  
  } else {
    res.end('<h1>Welcome!<h1>')
  }
  console.log(`Method: ${func.getJSONstring(req.method)}`)
  console.log(`url: ${func.getJSONstring(req.url)}`)
  console.log(`Headers: ${func.getJSONstring(req.headers)}`)
})
app.listen(port)
console.log(`The server has started and is listening on port: ${port}`)
