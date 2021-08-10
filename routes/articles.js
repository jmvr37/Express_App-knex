const knex = require('../db/client')
const router = require('express').Router()

// articles#new -> GET /articles/new
// Renders new article form
router.get('/new', (request, response) => { // The route is prepended already with /articles
  response.render('articles/new')
})

// articles#index -> GET /articles
// Show a list of all articles
router.get('/', (request, response) => {
  knex('articles')
    .orderBy('created_at', 'DESC')
    .then(articles => response.render('articles/index', { articles }))
})

// articles#show -> GET /articles/:id
router.get('/:id', async (request, response) => {
  // ":id" is a wildcard match. All words prefiexed with ":" are wildcards. It allows us to
  // access a URL param where the wildcard exists in the URL. We access the param values 
  // from the object "request.params". For example:
  // /:id/:name/:job with a URL of /5/Joe/Developer
  // request.params -> { id: "5", name: "Joe", job: "Developer"}
  const articleId = request.params.id
  // request.query -> Query string from GET -> ?key1=value1&key2=value2
  // request.body -> POST from form data, input name and values
  // request.cookies -> Cookie key/values
  // request.params -> URL params /articles/:articleId/comments/:id

  // knex('articles')
  //   .where('id', articleId)
  //   .first() // when an array is returned as data, only return the first element/object/row
  //   .then(article => {
  //     if (article) {
  //       knex('comments')
  //         .where('article_id', articleId)
  //         .then(comments => { 
  //           response.render('articles/show', { article, comments })
  //         })
  //     } else {
  //       response.send(`<h1>Cannot find article with id: ${id}</h1>`)
  //     }
  //   })

  // async/await is alternative way to handle promises. It's syntax sugar for the
  // ".then()" API. We can only use "await" inside of an "async" function (this route handler).
  // Using "await" in front of an asynchronous function call will pause the function until
  // the async operation has completed. In the example below, the knex query returns a
  // promise and saves it to the variable "article." The code below does the same thing as
  // the ".then()" example above:
  const article = await knex('articles').where('id', articleId).first()

  if (article) {
    const comments = await knex('comments').where('article_id', articleId)
    response.render('articles/show', { article, comments })
  } else {
    response.send(`<h1>Cannot find article with id: ${id}</h1>`)
  }
})

// articles#create -> POST /articles
// Creates an article in our articles table
router.post('/', (request, response) => {
  const { title, content } = request.body

  knex('articles')
    .insert({
      title,
      content,
      username: request.cookies.username || 'Anonymous',
      view_count: Math.floor(Math.random() * 1001),
    }, "*") // 2nd arg of "*" outputs an array of objects representing the rows that we inserted
    .then(() => {
      // This path is from the host, not /articles
      // It allows us to redirect to other routers
      response.redirect('/articles') 
    })
})

// articles#edit -> GET /articles/:id/edit
// Renders an edit form
router.get('/:id/edit', (request, response) => {
  const id = request.params.id
  knex('articles')
    .where('id', id)
    .first() // when an array is returned as data, only return the first element/object/row
    .then(article => {
      if (article) {
        response.render('articles/edit', { article })
      } else {
        response.send(`<h1>Cannot find article with id: ${id}</h1>`)
      }
    })
})

// articles#update -> PATCH /articles/:id
// Edit an article in the database
router.patch('/:id', (request, response) => {
  const id = request.params.id
  const { title, content } = request.body

  knex('articles')
    .where('id', id)
    .update({
      title,
      content,
    })
    .then(() => response.redirect(`/articles/${id}`))
})

// articles#delete -> DELETE /articles/:id
// Deletes an article from the database
router.delete('/:id', (request, response) => {
  const id = request.params.id

  knex('articles')
    .where('id', id)
    .del()
    .then(() => {
      console.log(`Deleted article with id: ${id}`)
      response.redirect('/articles')
    })
})

router.post('/:articleId/comments', (request, response) => {
  const articleId = request.params.articleId

  knex('comments')
    .insert({
      content: request.body.content,
      article_id: articleId,
    })
    .then(() => response.redirect(`/articles/${articleId}`))
})

module.exports = router