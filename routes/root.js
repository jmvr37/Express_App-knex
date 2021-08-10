const express = require('express')
// The "router" used routing. This lets us separate our routes into different files.
// After defining our routes, we export this router in "module.exports"
const router = express.Router()

// === ROUTES ===
// A route definition is a method that creates a response for a combination 
// of an HTTP VERB (method) and a URL PATH. It looks like this:

// app.METHOD(PATH, HANDLER) {...}

// Below, "get" is the METHOD named after the HTTP verb. There are similar
// methods for each verb (e.g. POST, PATCH, DELETE, OPTION, etc.)
// The arguments are:
// - PATH -> The URL path to match the route
// - HANDLER -> A callback that is passed a request and a response object.
//              This function usually ends the response

router.get('/hello_world', (request, response) => {
  // "request" is an object that holds data about the request from the client (browser)
  // "response" is an object that will be sent back to the client
  // We construct the response by calling methods on this object.
  // Data to be sent include resources like HTML, JSON, files, etc.
  // and the headers and status code

  // The "send" method of the "response" object takes a string and adds it to the
  // response's body, then terminates the response and sends it to the client.
  response.send('<h1>Hello, World!</h1>')
})

router.get('/', (request, response) => {
  // response.render(<ejs-file-path>)
  // Render a template located in "views/" + <ejs-file-path>
  // When writing the file path, you can omit the extension ".ejs".
  response.render('welcome')
})

router.get('/contact_us', (request, response) => response.render('contact'))

router.get('/thank_you', (request, response) => {
  // http://localhost:3000/thank_you?name=Anson&email=anson%40codecore.ca&message=Have+a+great+day
  // scheme| address |port|   path  | query

  // The "query" comes after the "?" in the URL. It encodes data as key-value pairs in the URL
  // itself. When a form gets submitted with a GET request, the query is included with the
  // request and we'll see it in the url. The key-value pairs store data from the form's inputs.
  
  // The encoding format looks like this:
  // ?key_1=value1&key_2=value_2&key3=value_3
  // Express takes the query string and converts it to an object
  // which we can access from "request.query".
  // { 
  //   key_1: value_1, 
  //   key_2: value_2, 
  //   key_3: value_3, 
  // }

  // "response.send()" is useful for debugging if you want to see the output
  // in the browser. Use it like you would use "console.log()".
  // response.send(request.query)

  const { name, email, message } = request.query
  // const name = request.query.name
  // const email = request.query.email
  // const message = request.query.message

  // We can pass an object as a second argument to "render" for our
  // local variables. These variables are availabe for us to use in 
  // the template that we render: { variableName: variableValue, }
  response.render('thank_you', {
    name, // name: name
    email,
    message,
  })
})

router.get('/survey', (request, response) => {
  const cats = [
    'Persian',
    'Garfield',
    'Sylvester',
    'Chester',
  ]

  const cheeses = [
    'Classic American Cheddar',
    'Feta',
    'Gouda',
    'Blue',
    'Brie',    
  ]

  const { name, colour, cat, cheese } = request.query
  response.render('survey', {
    cats, // cats: cats
    cheeses,
    name,
    favouriteColour: colour,
    favouriteCat: cat,
    favouriteCheese: cheese,
  })
})

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // number of milliseconds in 30 days
router.post('/sign_in', (request, response) => {
  // This route handles a POST request instead of a GET. Only with GET requests is the 
  // form data available in the query string e.g. "request.query". With a POST request,
  // we access the data from "request.body", which is only available if the "urlencoded"
  // middleware is used. It will contain data from an HTML form submitted from a POST request.
  const { username } = request.body

  // "response.cookie" is available for us to use if the "cookie-parser" middleware was
  // setup. Use it to send back cookies to the client. The arguments are:
  // response.cookie(<name-of-cookie>, <value-of-cookie>, <options>)
  // The "maxAge" property of <options> sets the age of the cookie. The time starts from when 
  // the cookie was set, plus the number of milliseconds for the age until expiration.
  response.cookie("username", username, { maxAge: COOKIE_MAX_AGE })

  // Like "response.send" and "response.render", "response.redirect" also terminates the
  // response. It sets a redirect status code (300s) and it also makes a follow-up 
  // request to the provided location. In this case, the request will go through all
  // our middleware again and hit our route handler that renders our welcome page (i.e. "/")
  response.redirect('/')
})

router.post('/sign_out', (request, response) => {
  // Deletes the cookie named 'username'
  response.clearCookie('username')
  response.redirect('/')
})

module.exports = router