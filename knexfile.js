// Update with your config settings.

// 1. npm i pg knex
// 2. knex init
// 3. Edit knexfile.js
// 4. createdb -e express_articles
// 5. knex migrate:make CreateArticles
// 6. Edit migration file
// 7. knex migrate:latest
// 8. Verify in DB
      // - psql -d express_articles
      // - SELECT * FROM articles;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'express_articles'
      // Linux requires the user and password
      // If you dont have a password for your user you'll need to create one:
      // $ psql
      // my_user=# \password
      
      // username: "al",
      // password: "supersecret",
    },
    migrations: {
      tableName: "migrations",
      directory: "./db/migrations",
    },
  },
};
