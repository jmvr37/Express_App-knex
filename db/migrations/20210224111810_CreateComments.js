exports.up = function(knex) {
  return knex.schema.createTable("comments", table => {
    table.bigIncrements("id") 
    table.text("content") 
    table
      .integer("article_id")
      .references("articles.id") // Foreign key
      .onUpdate('CASCADE') // If article.id is updated, update comment.article_id as well
      .onDelete('CASCADE') // If article is deleted, delete comment as well
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments')
};
