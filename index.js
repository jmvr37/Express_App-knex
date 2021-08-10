const path = require('path')
const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const rootRouter = require('./routes/root')
const articlesRouter = require('./routes/articles')
const { request, response } = require('express')

// Requiring the "express" package returns a function that creates
// an instance of the express application. More info here:
// http://expressjs.com/en/4x/api.html
const app = express()

// "view engine" is the name of an app setting
// The 2nd argument is the value to set the setting
// The package "ejs" will be our templating engine
app.set("view engine", "ejs")
// We can also specify the directory that express will look at for our
// templates by setting the "views" setting.
// By default, it will look in a directory called "views"
// app.set("views", "name_of_directory")

// === MIDDLEWARE ===

// LOGGER
// Morgan is a logger middleware that logs information about the request 
// the server's console. To use middleware, we pass a callback to the 
// method "app.use". To use morgan middleware, call it with a string
// that describes the format of the logs. The return value is a 
// middleware function that we pass to "app.use"
// More info here: https://github.com/expressjs/morgan#api
app.use(logger('dev'))

// STATIC ASSETS
// "path.join()" combines strings into a path. "__dirname" in Node returns
// the full path starting from the root of your machine "/" to where the
// location of the file where "__dirname" is used
// console.log(path.join(__dirname, 'public'))

// Statics assets are usually files that won't change such as images, css, 
// and js files. The "express.static()" middleware will make all assets 
// inside the specified path accessible by a client through a URL.

// Examples
// .public/images/cat.png -> http://localhost:3000/images/cat.png
// .public/css/main.css -> http://localhost:3000/css/main.css
app.use(express.static(path.join(__dirname, 'public')))

// COOKIE PARSER
// Cookies are limited to 4KB for the whole object. They exist until they
// expire (we set the expiration date). They are sent along with every request 
// to the server. The server also sends back the cookies after modifying them.
// e.g. a server can use cookies to authenticate
// Cookies are apecific for each domain and browser
// This middleware will parse cookies from the request 
// and make it available in "request.cookies".
app.use(cookieParser())

// URLENCODED
// This middleware will decode data coming from forms submitted with a POST request.
// The type of content is x-www-form-urlencoded, it adds that data to "request.body"
// When the "extended" option is set to "true", it allows forms to post data in 
// any shape of an array/object. If set to "false", it only accepts strings.
app.use(express.urlencoded({ extended: false }))

// === METHOD OVERRIDE ===
// HTML forms only support GET and POST requests. This middleware will be able to 
// override the HTTP verb. 
app.use(methodOverride((request, response) => {
  if (request.body && request.body._method) {
    const method = request.body._method

    // Delete method off of "request.body" because we won't be using it after overriding.
    delete request.body._method

    // Whatever is returned from this callback will be the new HTTP verb for the request.
    return method
  }
}))

// === CUSTOM MIDDLEWARE ===
// "app.use" takes in a callback, a middleware function. If we log out all previous
// arguments to "app.use", we'll see that the packages we're invoking all return a
// middleware function:
// console.log(logger('dev'))
// console.log(express.static(path.join(__dirname, 'public')))
// console.log(cookieParser())

// Middlewares are functions that are invoked in between the request and response.
// They are called in the order of the "app.use" calls in our script.
// The callbacks to our routes such as "app.get" are also middleware functions.
app.use((request, response, next) => {
  // Read cookies from "request.cookies". It is available when "cookie-parser"
  // middleware is used (use "cookie-parser" middleware before this middleware).
  // It's an object with key/value pairs of each cookie coming from the request.
  const { username } = request.cookies

  // Set properties on "response.locals" to create variables that are global
  // to all of our rendered templates including any partial views. The following 
  // line means that a variable named "username" will be availabe in all of our views.
  response.locals.username = username

  // The third argument in this middleware function is a callback usually named "next".
  // If the middleware doesn't terminate the response (e.g. response.send, response.render),
  // we should invoke next() to tell Express that this middleware has completed and to 
  // move on to the next middleware in the pipeline. Otherwise our request will hang.
  next()
})

// === URL (Uniform Resource Locator) ===
// http://localhost:3000/hello_world
// scheme| address |port| path
//       |     host     |

// The "scheme" is the protocol used to communicate. Some examples:
// - HTTP/HTTPS -> web content
// - FTP -> files
// - TCP -> networking
// - SMTP -> email

// The "host" combines the address and port
// It is the location of the server (or the domain pointing to it)

// The "path" points to content on a server, such as an HTML webpages, files, images, etc.

// === ROUTERS ===
app.use('/', rootRouter)
app.use('/articles', articlesRouter)

// If you host your server in the cloud, those services 
// might provide configuration for the port saved in process.env.PORT
// In class we'll be hosting it on localhost
const PORT = process.env.PORT || 3000
const ADDRESS = 'localhost' // 127.0.0.1

// The callback runs after the server has started
// Log the address in this format: `http://${ADDRESS}:${PORT}`
// to easily Cmd + click on it in the terminal to open it in the browser
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listenning on http://${ADDRESS}:${PORT}`)
})

